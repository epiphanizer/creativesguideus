import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "treatment";

  const rootDir = process.cwd();
  const fileName =
    type === "screenplay"
      ? "BONG TOUR Screenplay.pdf"
      : "BONG TOUR Treatment.pdf";

  const filePath = path.join(rootDir, "lib", "bong-tour", fileName);

  try {
    const fileBuffer = await readFile(filePath);
    const downloadName =
      type === "screenplay"
        ? "Bong-Tour-Screenplay-First-Draft.pdf"
        : "Bong-Tour-Treatment-Overview.pdf";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${downloadName}"`,
        "Cache-Control": "public, max-age=3600, s-maxage=86400"
      }
    });
  } catch {
    return NextResponse.json(
      { error: "Requested screenplay document not found." },
      { status: 404 }
    );
  }
}
