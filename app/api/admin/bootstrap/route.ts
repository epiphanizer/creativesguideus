import { NextResponse } from "next/server";

import { getWallsDevineAdminData } from "@/lib/admin/walls-devine";
import { verifyFirebaseIdToken } from "@/lib/firebase/server-auth";

export const dynamic = "force-dynamic";

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";

  if (!authorization.startsWith("Bearer ")) {
    return "";
  }

  return authorization.slice("Bearer ".length).trim();
}

export async function GET(request: Request) {
  const idToken = getBearerToken(request);
  const verifiedUser = await verifyFirebaseIdToken(idToken);

  if (!verifiedUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const localData = await getWallsDevineAdminData();
  return NextResponse.json(localData, { status: 200 });
}