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
    title: "Physical Bound Script & Collector Tribute",
    description: "First-edition bound screenplay draft with original writer annotations, watermarked reading certificate, and Appreesh tribute receipt.",
    allocation: "Limited to 50 Numbered Studio Copies"
  },
  premiere_pass: {
    id: "premiere_pass",
    title: "VIP Premiere Screening & Festival Pass",
    description: "Festival premiere companion invitation, afterparty RSVP allocation, and early digital access to final cut screening rooms.",
    allocation: "Studio Guest List Tier"
  },
  collector_tribute: {
    id: "collector_tribute",
    title: "Appreesh On-Chain Producer Tribute",
    description: "Solana/Anchor tribute receipt recognized in the packaging ledger and early digital backer roll.",
    allocation: "Open Protocol Drop"
  }
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidSolanaWallet(wallet: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      walletAddress?: string;
      tierId?: string;
      note?: string;
    };

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
