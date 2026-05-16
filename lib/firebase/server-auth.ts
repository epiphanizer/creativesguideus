import { firebaseConfig } from "./config";

type FirebaseLookupResponse = {
  users?: Array<{
    localId?: string;
    email?: string;
    emailVerified?: boolean;
  }>;
};

export type VerifiedFirebaseUser = {
  uid: string;
  email?: string;
  emailVerified: boolean;
};

export async function verifyFirebaseIdToken(idToken: string) {
  if (!idToken) {
    return null;
  }

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ idToken }),
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as FirebaseLookupResponse;
  const user = payload.users?.[0];

  if (!user?.localId) {
    return null;
  }

  return {
    uid: user.localId,
    email: user.email,
    emailVerified: Boolean(user.emailVerified)
  } satisfies VerifiedFirebaseUser;
}