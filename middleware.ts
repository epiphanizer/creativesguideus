import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limit";

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public audio/image files (e.g. .wav, .png, .jpg, .svg)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:wav|mp3|png|jpg|jpeg|gif|webp|svg|ico)$).*)"
  ]
};

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

function applySecurityHeaders(response: NextResponse): void {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), browsing-topics=()");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-XSS-Protection", "1; mode=block");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  // ── API Route Protection ──────────────────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    // 1. Content-Length check to reject memory-exhaustion payloads immediately
    const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
    const maxPayloadBytes = pathname.startsWith("/api/bong-tour/giveaway")
      ? 32 * 1024 // 32KB max for giveaway form
      : 256 * 1024; // 256KB max for general API calls

    if (contentLength > maxPayloadBytes) {
      const response = NextResponse.json(
        { ok: false, error: "Payload too large. Exceeds permissible request size." },
        { status: 413 }
      );
      applySecurityHeaders(response);
      return response;
    }

    // 2. Sliding window rate limiting per route tier
    let limit = 60;
    let windowMs = 60 * 1000; // 60s
    let routeKey = "general";

    if (pathname.startsWith("/api/bong-tour/giveaway")) {
      // Sensitive ingestion: max 5 entries per 5 minutes per IP
      limit = 5;
      windowMs = 5 * 60 * 1000;
      routeKey = "giveaway";
    } else if (
      pathname.startsWith("/api/bong-tour/treatment/access") ||
      pathname.startsWith("/api/cache/access")
    ) {
      // Sensitive password auth gates: max 5 attempts per 5 minutes per IP
      limit = 5;
      windowMs = 5 * 60 * 1000;
      routeKey = "authgate";
    } else if (pathname.startsWith("/api/admin/")) {
      // Admin endpoints: max 30 attempts per minute per IP
      limit = 30;
      windowMs = 60 * 1000;
      routeKey = "admin";
    }

    const rateLimit = checkRateLimit({
      key: `ip:${ip}:${routeKey}`,
      maxRequests: limit,
      windowMs
    });

    if (!rateLimit.isAllowed) {
      const response = NextResponse.json(
        {
          ok: false,
          error: "Rate limit exceeded. Too many requests. Please wait before retrying."
        },
        { status: 429 }
      );

      applySecurityHeaders(response);
      response.headers.set("Retry-After", String(rateLimit.retryAfterSeconds));
      response.headers.set("X-RateLimit-Limit", String(rateLimit.limit));
      response.headers.set("X-RateLimit-Remaining", "0");
      response.headers.set("X-RateLimit-Reset", String(rateLimit.resetTime));
      return response;
    }

    // Proceed with request and inject rate-limit headers on response
    const response = NextResponse.next();
    applySecurityHeaders(response);
    response.headers.set("X-RateLimit-Limit", String(rateLimit.limit));
    response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
    response.headers.set("X-RateLimit-Reset", String(rateLimit.resetTime));
    return response;
  }

  // ── Web Page & Resource Protection ────────────────────────────────────────
  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}
