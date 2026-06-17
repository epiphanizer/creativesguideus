import { NextRequest, NextResponse } from "next/server";

import {
  createCacheSession,
  getCacheSessionCookieName,
  getCacheSessionMaxAgeSeconds,
  tryLogCacheAccessAttempt,
  verifyCacheGate
} from "@/lib/cache/access";
import { isFirebaseAdminConfigError } from "@/lib/firebase/server-admin";

export const dynamic = "force-dynamic";

function getClientIp(request: NextRequest) {
  return (request.headers.get("x-forwarded-for") ?? "")
    .split(",")
    .map((part) => part.trim())
    .find(Boolean) ?? "";
}

async function delayFailedAttempt() {
  await new Promise((resolve) => {
    setTimeout(resolve, 450);
  });
}

function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: getCacheSessionCookieName(),
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0
  });
}

export async function POST(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") ?? "";
  const ipAddress = getClientIp(request);

  try {
    const payload = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = typeof payload?.email === "string" ? payload.email : "";
    const password = typeof payload?.password === "string" ? payload.password : "";
    const result = await verifyCacheGate({ email, password });

    if (!result.ok) {
      await tryLogCacheAccessAttempt({
        email: result.normalizedEmail,
        success: false,
        reason: "invalid_credentials",
        ipAddress,
        userAgent
      });
      await delayFailedAttempt();
      return NextResponse.json(
        {
          error: "Access unavailable. Share your email through guided intake first, then use the current access password."
        },
        { status: 401 }
      );
    }

    await tryLogCacheAccessAttempt({
      email: result.normalizedEmail,
      success: true,
      reason: "granted",
      ipAddress,
      userAgent
    });

    const response = NextResponse.json({ ok: true }, { status: 200 });
    response.cookies.set({
      name: getCacheSessionCookieName(),
      value: createCacheSession(result.normalizedEmail),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: getCacheSessionMaxAgeSeconds()
    });

    return response;
  } catch (error) {
    await delayFailedAttempt();

    return NextResponse.json(
      {
        error: isFirebaseAdminConfigError(error)
          ? "Access is not configured on the server yet. Add Firebase admin credentials or explicitly enable Application Default Credentials for this runtime."
          : "Access is not configured on the server yet."
      },
      { status: 503 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true }, { status: 200 });
  clearSessionCookie(response);
  return response;
}
