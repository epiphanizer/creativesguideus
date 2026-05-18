import { collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";

import { firebaseDb } from "./client";
import { firebaseAdminPaths } from "./config";

export type EcosystemRewardClaimInput = {
  rewardId: string;
  rewardLabel: string;
  rewardType: string;
  chapter: string;
  source: string;
  email?: string;
  collectorId?: string;
};

type CollectorRecord = {
  email?: string;
  collector_id?: string;
  total_rewards_claimed?: number;
  total_stashes_found?: number;
};

function normalizeEmail(value?: string) {
  return (value ?? "").trim().toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeCollectorId(value?: string) {
  return (value ?? "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120)
    .toLowerCase();
}

function normalizeText(value: string | undefined, maxLength: number) {
  return (value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

export async function createEcosystemRewardClaim(input: EcosystemRewardClaimInput) {
  if (!firebaseDb) {
    throw new Error("Firestore is not initialized for this Firebase project.");
  }

  const email = normalizeEmail(input.email);
  const collectorId = normalizeCollectorId(input.collectorId);

  if (!email && !collectorId) {
    throw new Error("Drop an email or Collector ID so we can route the reward.");
  }

  if (email && !isValidEmail(email)) {
    throw new Error("Please enter a valid email address.");
  }

  const rewardId = normalizeText(input.rewardId, 120);
  const rewardLabel = normalizeText(input.rewardLabel, 160);
  const rewardType = normalizeText(input.rewardType, 80);
  const chapter = normalizeText(input.chapter, 120);
  const source = normalizeText(input.source, 120);

  if (!rewardId || !rewardLabel || !rewardType || !chapter || !source) {
    throw new Error("Reward metadata is incomplete.");
  }

  const collectorKey = collectorId || email;

  if (!collectorKey) {
    throw new Error("Collector identity is missing.");
  }

  const collectorDocRef = doc(firebaseDb, firebaseAdminPaths.collectorsCollection, collectorKey);
  const rewardClaimsCollection = collection(firebaseDb, firebaseAdminPaths.rewardClaimsCollection);
  let claimId = "";

  await runTransaction(firebaseDb, async (transaction) => {
    const collectorSnapshot = await transaction.get(collectorDocRef);
    const collectorData = (collectorSnapshot.data() ?? {}) as CollectorRecord;
    const currentClaimCount =
      typeof collectorData.total_rewards_claimed === "number"
        ? collectorData.total_rewards_claimed
        : typeof collectorData.total_stashes_found === "number"
          ? collectorData.total_stashes_found
          : 0;
    const nextClaimCount = currentClaimCount + 1;

    const collectorPayload = {
      email: email || collectorData.email || "",
      collector_id: collectorId || collectorData.collector_id || "",
      updated_at: serverTimestamp(),
      total_rewards_claimed: nextClaimCount,
      total_stashes_found: nextClaimCount
    };

    if (collectorSnapshot.exists()) {
      transaction.set(collectorDocRef, collectorPayload, { merge: true });
    } else {
      transaction.set(collectorDocRef, {
        ...collectorPayload,
        joined_at: serverTimestamp()
      });
    }

    const claimDocRef = doc(rewardClaimsCollection);
    claimId = claimDocRef.id;

    transaction.set(claimDocRef, {
      collector_ref: collectorDocRef,
      collector_key: collectorKey,
      email,
      collector_id: collectorId,
      reward_id: rewardId,
      reward_label: rewardLabel,
      chapter,
      reward_type: rewardType,
      claimed_at: serverTimestamp(),
      status: "pending_distribution",
      source
    });
  });

  return {
    claimId,
    collectorKey
  };
}
