import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

const MIME_MAP: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".wasm": "application/wasm",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf"
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ file: string[] }> }
) {
  const { file } = await context.params;
  const relPath = Array.isArray(file) ? file.join("/") : file;

  // Prevent directory traversal
  const safeRelPath = path.normalize(relPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const baseDir = path.join(process.cwd(), "public", "studio-app");
  const fullPath = path.join(baseDir, safeRelPath);

  if (!fullPath.startsWith(baseDir) || !fs.existsSync(fullPath)) {
    return new NextResponse("File Not Found", { status: 404 });
  }

  const stat = fs.statSync(fullPath);
  if (stat.isDirectory()) {
    const indexInDir = path.join(fullPath, "index.html");
    if (fs.existsSync(indexInDir)) {
      const content = fs.readFileSync(indexInDir);
      return new NextResponse(content, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }
    return new NextResponse("Not Found", { status: 404 });
  }

  const ext = path.extname(fullPath).toLowerCase();
  const contentType = MIME_MAP[ext] || "application/octet-stream";
  const content = fs.readFileSync(fullPath);

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(stat.size),
      "Cache-Control": ext === ".html" ? "no-cache, must-revalidate" : "public, max-age=31536000, immutable"
    }
  });
}
