import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET() {
  const indexPath = path.join(process.cwd(), "public", "studio-app", "index.html");
  if (!fs.existsSync(indexPath)) {
    return new NextResponse("johnwalls.studio web app not yet deployed. Run make push.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const content = fs.readFileSync(indexPath);
  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, must-revalidate"
    }
  });
}
