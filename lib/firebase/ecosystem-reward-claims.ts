import { FirebaseError } from "firebase/app";
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
  walletAddress?: string;
  airdropKey?: string;
  maxClaimsPerWallet?: number;
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

function normalizeWalletAddress(value?: string) {
  return (value ?? "").trim();
}

function isValidSolanaWallet(value: string) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value);
}

function buildAirdropClaimId(rewardKey: string, walletAddress: string) {
  return `${rewardKey}__${walletAddress}`;
}

export async function createEcosystemRewardClaim(input: EcosystemRewardClaimInput) {
  if (!firebaseDb) {
    throw new Error("Firestore is not initialized for this Firebase project.");
  }

  const email = normalizeEmail(input.email);
  const collectorId = normalizeCollectorId(input.collectorId);
  const walletAddress = normalizeWalletAddress(input.walletAddress);

  if (!email && !collectorId && !walletAddress) {
    throw new Error("Drop an email, Collector ID, or wallet so we can route the reward.");
  }

  if (email && !isValidEmail(email)) {
    throw new Error("Please enter a valid email address.");
  }

  if (walletAddress && !isValidSolanaWallet(walletAddress)) {
    throw new Error("Please enter a valid Solana wallet address.");
  }

  const rewardId = normalizeText(input.rewardId, 120);
  const rewardLabel = normalizeText(input.rewardLabel, 160);
  const rewardType = normalizeText(input.rewardType, 80);
  const chapter = normalizeText(input.chapter, 120);
  const source = normalizeText(input.source, 120);
  const airdropKey = normalizeText(input.airdropKey, 120);
  const maxClaimsPerWallet = typeof input.maxClaimsPerWallet === "number" ? input.maxClaimsPerWallet : 0;

  if (!rewardId || !rewardLabel || !rewardType || !chapter || !source) {
    throw new Error("Reward metadata is incomplete.");
  }

  if (maxClaimsPerWallet > 0 && !walletAddress) {
    throw new Error("This unlock needs a wallet address before the airlock can open.");
  }

  const collectorKey = collectorId || email || walletAddress;

  if (!collectorKey) {
    throw new Error("Collector identity is missing.");
  }

  const collectorDocRef = doc(firebaseDb, firebaseAdminPaths.collectorsCollection, collectorKey);
  const rewardClaimsCollection = collection(firebaseDb, firebaseAdminPaths.rewardClaimsCollection);
  const claimDocId = maxClaimsPerWallet > 0
    ? buildAirdropClaimId(airdropKey || rewardId, walletAddress)
    : undefined;
  let claimId = "";

  try {
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

      const claimDocRef = claimDocId ? doc(rewardClaimsCollection, claimDocId) : doc(rewardClaimsCollection);
      claimId = claimDocRef.id;

      transaction.set(claimDocRef, {
        collector_ref: collectorDocRef,
        collector_key: collectorKey,
        email,
        collector_id: collectorId,
        wallet_address: walletAddress,
        reward_id: rewardId,
        reward_label: rewardLabel,
        chapter,
        reward_type: rewardType,
        claimed_at: serverTimestamp(),
        status: "pending_distribution",
        source,
        distribution_mode: maxClaimsPerWallet > 0 ? "airdrop" : "direct",
        airdrop_key: airdropKey,
        max_claims_per_wallet: maxClaimsPerWallet
      });
    });
  } catch (error) {
    if (error instanceof FirebaseError && error.code === "permission-denied" && maxClaimsPerWallet > 0) {
      throw new Error("This wallet already cleared the airlock for this unlock.");
    }

    throw error;
  }

  return {
    claimId,
    collectorKey
  };
}
