import { logger } from "firebase-functions";

const defaultRewardDistributionProvider = "legacy";
const appreeshRewardDistributionProvider = "appreesh-solana";

const rewardDistributionHandlers = {
  [defaultRewardDistributionProvider]: async ({ claimId, rewardType, rewardLabel }) => ({
    claimStatus: "distributed",
    providerStatus: "logged_for_distribution",
    distributionLog: `Logged ${rewardType} (${rewardLabel}) for downstream distribution.`,
    logDetail: `Legacy dispatch path recorded for claim ${claimId}.`
  }),
  [appreeshRewardDistributionProvider]: async ({ claimId, rewardLabel, walletAddress }) => ({
    claimStatus: "pending_provider_setup",
    providerStatus: "pending_provider_setup",
    distributionLog: `Appreesh token distribution queued for ${rewardLabel}. On-chain dispatch remains disabled until provider config is finalized.`,
    logDetail: `Appreesh scaffold path captured for claim ${claimId} (${walletAddress || "no wallet"}).`
  })
};

export function resolveRewardDistributionProvider(value) {
  return value === appreeshRewardDistributionProvider ? appreeshRewardDistributionProvider : defaultRewardDistributionProvider;
}

export async function dispatchRewardClaim({
  claimId,
  rewardType,
  rewardLabel,
  distributionProvider,
  walletAddress
}) {
  const provider = resolveRewardDistributionProvider(distributionProvider);
  const handler = rewardDistributionHandlers[provider];
  const result = await handler({ claimId, rewardType, rewardLabel, walletAddress });

  logger.info("Reward distribution dispatch processed.", {
    claimId,
    rewardType,
    rewardLabel,
    distributionProvider: provider,
    providerStatus: result.providerStatus
  });

  return {
    ...result,
    distributionProvider: provider
  };
}
