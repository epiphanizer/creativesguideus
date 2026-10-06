import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export const dynamic = "force-dynamic";

const STUDIO_APP_DIR = path.join(process.cwd(), "public", "studio-app");
const MANIFEST_PATH = path.join(STUDIO_APP_DIR, "deploy-manifest.json");

export async function GET() {
  try {
    const isDeployed = fs.existsSync(path.join(STUDIO_APP_DIR, "index.html"));
    let manifest: Record<string, unknown> | null = null;

    if (fs.existsSync(MANIFEST_PATH)) {
      try {
        manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
      } catch {
        manifest = null;
      }
    }

    return NextResponse.json({
      ok: true,
      service: "johnwalls.studio auto-deployer",
      isDeployed,
      publicUrl: "https://johnwalls.studio/app",
      directUrl: "https://johnwalls.studio/studio-app/index.html",
      manifest,
      serverTime: new Date().toISOString()
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Check authorization token if STUDIO_DEPLOY_TOKEN environment variable is set
    const expectedToken = process.env.STUDIO_DEPLOY_TOKEN;
    if (expectedToken) {
      const authHeader = request.headers.get("authorization") || "";
      const customHeader = request.headers.get("x-studio-deploy-key") || "";
      const token = authHeader.replace(/^Bearer\s+/i, "") || customHeader;
      if (token !== expectedToken) {
        return NextResponse.json(
          { ok: false, error: "Unauthorized. Invalid deployment key." },
          { status: 401 }
        );
      }
    }

    // 2. Parse incoming multipart form data
    const formData = await request.formData();
    const bundleFile = formData.get("bundle") as File | null;
    const version = (formData.get("version") as string) || `v_${Date.now()}`;
    const runBuild = formData.get("runBuild") === "true" || formData.get("runBuild") === "1";

    if (!bundleFile) {
      return NextResponse.json(
        { ok: false, error: "No bundle file provided in request (field 'bundle' required)" },
        { status: 400 }
      );
    }

    // 3. Ensure target directory exists
    if (!fs.existsSync(STUDIO_APP_DIR)) {
      fs.mkdirSync(STUDIO_APP_DIR, { recursive: true });
    }

    const originalName = bundleFile.name.toLowerCase();
    const isZip = originalName.endsWith(".zip");
    const isTar = originalName.endsWith(".tar.gz") || originalName.endsWith(".tgz") || originalName.endsWith(".tar");

    if (!isZip && !isTar) {
      return NextResponse.json(
        { ok: false, error: "Unsupported bundle format. Please upload .zip or .tar.gz / .tgz archive." },
        { status: 400 }
      );
    }

    // 4. Save archive to temporary staging file
    const ext = isZip ? ".zip" : ".tar.gz";
    const tempFile = path.join("/tmp", `johnwalls-studio-bundle-${Date.now()}${ext}`);
    const arrayBuffer = await bundleFile.arrayBuffer();
    await fs.promises.writeFile(tempFile, Buffer.from(arrayBuffer));

    // 5. Extract bundle into studio-app directory
    try {
      if (isZip) {
        await execFileAsync("unzip", ["-o", tempFile, "-d", STUDIO_APP_DIR]);
      } else {
        await execFileAsync("tar", ["-xzf", tempFile, "-C", STUDIO_APP_DIR]);
      }
    } finally {
      // Always cleanup temp archive
      try {
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
      } catch {}
    }

    // 6. If the archive was nested in a 'dist' directory, hoist contents to root of STUDIO_APP_DIR
    const nestedDist = path.join(STUDIO_APP_DIR, "dist");
    if (fs.existsSync(nestedDist) && fs.statSync(nestedDist).isDirectory()) {
      const distFiles = fs.readdirSync(nestedDist);
      for (const f of distFiles) {
        const srcPath = path.join(nestedDist, f);
        const destPath = path.join(STUDIO_APP_DIR, f);
        if (fs.existsSync(destPath)) {
          fs.rmSync(destPath, { recursive: true, force: true });
        }
        fs.renameSync(srcPath, destPath);
      }
      try {
        fs.rmdirSync(nestedDist);
      } catch {}
    }

    // 7. Verify index.html is present
    const indexPath = path.join(STUDIO_APP_DIR, "index.html");
    if (!fs.existsSync(indexPath)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Bundle extracted, but 'index.html' was not found in the root of the distribution."
        },
        { status: 422 }
      );
    }

    // 8. Collect file statistics
    const extractedFiles: string[] = [];
    const collectFiles = (dir: string, base: string = "") => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const full = path.join(dir, item);
        const rel = base ? `${base}/${item}` : item;
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          collectFiles(full, rel);
        } else {
          extractedFiles.push(rel);
        }
      }
    };
    collectFiles(STUDIO_APP_DIR);

    // 9. Write deployment manifest
    const manifest = {
      deployedAt: new Date().toISOString(),
      version,
      bundleFileName: bundleFile.name,
      bundleSizeBytes: arrayBuffer.byteLength,
      fileCount: extractedFiles.length,
      runBuildTriggered: runBuild,
      files: extractedFiles.slice(0, 50),
      publicUrl: "https://johnwalls.studio/app",
      directUrl: "https://johnwalls.studio/studio-app/index.html"
    };

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");

    return NextResponse.json(
      {
        ok: true,
        message: "johnwalls.studio web application auto-pushed & deployed successfully!",
        publicUrl: manifest.publicUrl,
        directUrl: manifest.directUrl,
        manifest
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Deploy endpoint error:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Deployment failed" },
      { status: 500 }
    );
  }
}
