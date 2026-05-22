import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

import {
  canUseLocalTreatmentFallback,
  decodeTreatmentSession,
  getProtectedTreatmentContent,
  getTreatmentSessionCookieName,
  syncTreatmentContentIfMissing,
  tryLogTreatmentAccessAttempt
} from "@/lib/bong-tour/treatment-access";
import { isFirebaseAdminConfigError } from "@/lib/firebase/server-admin";

export const dynamic = "force-dynamic";

const treatmentFilePath = path.join(process.cwd(), "app", "bong-tour", "treatment.txt");

async function ensurePrivateTreatmentSeeded() {
  try {
    const content = await readFile(treatmentFilePath, "utf8");
    await syncTreatmentContentIfMissing({
      title: "Bong Tour treatment",
      content,
      source: "local-seed"
    });
  } catch (error) {
    const maybeError = error as NodeJS.ErrnoException;

    if (maybeError.code === "ENOENT") {
      return;
    }

    throw error;
  }
}

async function getLocalFallbackTreatmentContent() {
  const content = await readFile(treatmentFilePath, "utf8");

  return {
    title: "Bong Tour treatment",
    content: content.trimEnd() ? `${content.trimEnd()}\n` : content,
    updatedAt: "",
    source: "local-development"
  };
}

function getClientIp(request: NextRequest) {
  return (request.headers.get("x-forwarded-for") ?? "")
    .split(",")
    .map((part) => part.trim())
    .find(Boolean) ?? "";
}

export async function GET(request: NextRequest) {
  const session = decodeTreatmentSession(request.cookies.get(getTreatmentSessionCookieName())?.value);

  if (!session) {
    return NextResponse.json({ error: "Treatment access required." }, { status: 401 });
  }

  try {
    await ensurePrivateTreatmentSeeded();
    const treatment = await getProtectedTreatmentContent();

    return NextResponse.json({ ...treatment, viewerEmail: session.email }, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store, max-age=0"
      }
    });
  } catch (error) {
    if (isFirebaseAdminConfigError(error) && canUseLocalTreatmentFallback()) {
      const treatment = await getLocalFallbackTreatmentContent();

      return NextResponse.json({ ...treatment, viewerEmail: session.email }, {
        status: 200,
        headers: {
          "Cache-Control": "private, no-store, max-age=0"
        }
      });
    }

    await tryLogTreatmentAccessAttempt({
      email: session.email,
      success: false,
      reason: "content_error",
      ipAddress: getClientIp(request),
      userAgent: request.headers.get("user-agent") ?? ""
    });

    return NextResponse.json(
      {
        error: isFirebaseAdminConfigError(error)
          ? "Treatment access is not configured on the server yet. Add Firebase admin credentials or explicitly enable Application Default Credentials for this runtime."
          : "Treatment access is configured, but the private Firebase copy is not ready yet."
      },
      { status: 503 }
    );
  }
}