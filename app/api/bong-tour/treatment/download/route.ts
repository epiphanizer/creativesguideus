import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

import {
  decodeTreatmentSession,
  getTreatmentSessionCookieName
} from "@/lib/bong-tour/treatment-access";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Gate screenplay and treatment downloads: require an authorized access session
  const session = decodeTreatmentSession(
    request.cookies.get(getTreatmentSessionCookieName())?.value
  );

  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Treatment access pass required to download studio materials." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const rawType = searchParams.get("type");
  const type = rawType === "screenplay" ? "screenplay" : "treatment";

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
        "Cache-Control": "private, no-store, max-age=0"
      }
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Requested screenplay document not found." },
      { status: 404 }
    );
  }
}
