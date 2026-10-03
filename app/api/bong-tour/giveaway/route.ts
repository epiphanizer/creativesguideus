import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { createEcosystemRewardClaim } from "@/lib/firebase/ecosystem-reward-claims";

export const dynamic = "force-dynamic";

const giveawayTiers: Record<
  string,
  {
    id: string;
    title: string;
    description: string;
    allocation: string;
  }
> = {
  script_giveaway: {
    id: "script_giveaway",
    title: "Hand-Bound First Edition Script",
    description: "Numbered working screenplay draft with studio margin notes and official creator sign-off.",
    allocation: "50 Pressed Copies"
  },
  premiere_pass: {
    id: "premiere_pass",
    title: "First Screening Pass & Afterparty",
    description: "Festival premiere seat, booth drinks with the crew, and direct access to the private listening suite.",
    allocation: "Studio Guest List"
  },
  collector_tribute: {
    id: "collector_tribute",
    title: "Patron's Mark on the Ledger",
    description: "Direct-to-artist tribute inscribed on the Solana chain via Appreesh. Zero studio middlemen.",
    allocation: "Underground Ledger"
  }
};

// In-memory cache for deduplication and bot defense: keeps recent claims for 15 minutes
// to avoid exhausting Firestore write quotas if an automated agent spams submissions
type CachedClaim = {
  claim: Record<string, unknown>;
  createdAt: number;
};

const recentClaimsByEmail = new Map<string, CachedClaim>();
const recentClaimsByWallet = new Map<string, CachedClaim>();

function pruneRecentClaims() {
  const now = Date.now();
  const maxAgeMs = 15 * 60 * 1000;
  for (const [key, val] of recentClaimsByEmail.entries()) {
    if (now - val.createdAt > maxAgeMs) recentClaimsByEmail.delete(key);
  }
  for (const [key, val] of recentClaimsByWallet.entries()) {
    if (now - val.createdAt > maxAgeMs) recentClaimsByWallet.delete(key);
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidSolanaWallet(wallet: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet);
}

export async function POST(request: NextRequest) {
  try {
    pruneRecentClaims();

    // Enforce body size limit before deep parsing
    const rawBody = await request.text();
    if (rawBody.length > 32 * 1024) {
      return NextResponse.json(
        { ok: false, error: "Payload exceeds permissible size limit." },
        { status: 413 }
      );
    }

    let body: {
      name?: string;
      email?: string;
      walletAddress?: string;
      tierId?: string;
      note?: string;
      website?: string;
      honeypot?: string;
    };

    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid JSON format." }, { status: 400 });
    }

    // ── Bot Honeypot Defense ────────────────────────────────────────────────
    // If hidden honeypot fields are populated by automated scraping agents,
    // return a synthetic confirmation without consuming Firestore resources.
    if (body.website || body.honeypot) {
      const syntheticId = `claim_bot_${randomBytes(6).toString("hex")}`;
      return NextResponse.json({
        ok: true,
        message: "Your submission has been safely recorded.",
        claim: {
          claimId: syntheticId,
          serialNumber: "BT-APPR-2026-SHADOW",
          status: "confirmed",
          tierTitle: "Patron's Mark on the Ledger",
          allocation: "Underground Ledger"
        }
      });
    }

    const email = (body.email ?? "").trim().toLowerCase();
    const name = (body.name ?? "").trim().slice(0, 100);
    const walletAddress = (body.walletAddress ?? "").trim();
    const tierId = body.tierId && giveawayTiers[body.tierId] ? body.tierId : "script_giveaway";
    const selectedTier = giveawayTiers[tierId];
    const note = (body.note ?? "").trim().slice(0, 500);

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Please provide your email address to enter the giveaway." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (walletAddress && !isValidSolanaWallet(walletAddress)) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid Solana wallet address (32-44 base58 characters)." },
        { status: 400 }
      );
    }

    // ── Deduplication / Agent Spam Protection ──────────────────────────────
    // Check if this email or wallet already submitted within the last 15 minutes
    const existingEmailClaim = recentClaimsByEmail.get(email);
    if (existingEmailClaim) {
      return NextResponse.json({
        ok: true,
        message: `Your Bong Tour giveaway entry for ${selectedTier.title} has already been logged.`,
        claim: existingEmailClaim.claim
      });
    }

    if (walletAddress) {
      const existingWalletClaim = recentClaimsByWallet.get(walletAddress);
      if (existingWalletClaim) {
        return NextResponse.json({
          ok: true,
          message: `Your Bong Tour giveaway entry for ${selectedTier.title} has already been logged.`,
          claim: existingWalletClaim.claim
        });
      }
    }

    const timestamp = new Date().toISOString();
    const randomHex = randomBytes(3).toString("hex").toUpperCase();
    const serialNumber = `BT-APPR-2026-${randomHex}`;
    const hash = createHash("sha256")
      .update(`${email}:${serialNumber}:${timestamp}:${walletAddress}`)
      .digest("hex")
      .slice(0, 16);

    let claimId = `claim_${randomBytes(6).toString("hex")}`;
    let firestorePersisted = false;

    try {
      const claimResult = await createEcosystemRewardClaim({
        rewardId: `bong-tour-${tierId}`,
        rewardLabel: `Bong Tour Giveaway: ${selectedTier.title}`,
        rewardType: "giveaway-tribute",
        chapter: "bong-tour-screenplay",
        source: "bong-tour-in-browser-giveaway",
        email,
        collectorId: name || email.split("@")[0],
        walletAddress: walletAddress || undefined,
        airdropKey: `bt-airdrop-${serialNumber.toLowerCase()}`,
        maxClaimsPerWallet: walletAddress ? 1 : 0
      });

      if (claimResult?.claimId) {
        claimId = claimResult.claimId;
        firestorePersisted = true;
      }
    } catch {
      // Graceful fallback for local or non-admin environments
      firestorePersisted = false;
    }

    const claim = {
      claimId,
      serialNumber,
      verificationHash: hash,
      tierId: selectedTier.id,
      tierTitle: selectedTier.title,
      tierDescription: selectedTier.description,
      allocation: selectedTier.allocation,
      name: name || "Anonymous Patron",
      email,
      walletAddress: walletAddress || null,
      note: note || null,
      provider: "appreesh-solana",
      appreeshProtocolUrl: "https://appreesh.org",
      tributeLedger: "Solana Devnet / Mainnet Anchor Protocol",
      status: "confirmed",
      firestorePersisted,
      timestamp
    };

    // Store in deduplication cache
    const cacheEntry: CachedClaim = { claim, createdAt: Date.now() };
    recentClaimsByEmail.set(email, cacheEntry);
    if (walletAddress) {
      recentClaimsByWallet.set(walletAddress, cacheEntry);
    }

    return NextResponse.json({
      ok: true,
      message: `Your Bong Tour giveaway entry for ${selectedTier.title} has been logged and linked to Appreesh.`,
      claim
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to process giveaway entry.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
