import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "cgu_admin_session";
const ADMIN_SESSION_VALUE = "walls-devine-local";

export const adminAuthConfig = {
  provider: "local-file",
  firebaseReady: true,
  cookieName: ADMIN_SESSION_COOKIE
} as const;

export function verifyAdminCredentials(username: string, password: string) {
  return username.trim().toLowerCase() === "walls" && password === "devine";
}

export async function hasAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value === ADMIN_SESSION_VALUE;
}

export async function createAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
