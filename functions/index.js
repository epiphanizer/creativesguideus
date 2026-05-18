import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

initializeApp();

const firestore = getFirestore();

export const onEcosystemRewardClaimed = onDocumentCreated(
  {
    document: "rewardClaims/{claimId}",
    region: "us-central1"
  },
  async (event) => {
    const snapshot = event.data;

    if (!snapshot) {
      logger.warn("Reward claim trigger fired without document data.", { params: event.params });
      return;
    }

    const claimData = snapshot.data();
    const claimId = event.params.claimId;
    const rewardId = typeof claimData.reward_id === "string" ? claimData.reward_id : "unknown";
    const rewardType = typeof claimData.reward_type === "string" ? claimData.reward_type : "unknown";
    const rewardLabel = typeof claimData.reward_label === "string" ? claimData.reward_label : "Unknown reward";
    const chapter = typeof claimData.chapter === "string" ? claimData.chapter : "Unknown chapter";

    logger.info("Processing ecosystem reward claim.", {
      claimId,
      rewardId,
      rewardType,
      rewardLabel,
      chapter
    });

    await firestore.collection("rewardDispatchLogs").doc(claimId).set({
      claim_ref: snapshot.ref,
      reward_id: rewardId,
      reward_type: rewardType,
      reward_label: rewardLabel,
      chapter,
      logged_at: FieldValue.serverTimestamp(),
      status: "logged_for_distribution"
    });

    await snapshot.ref.set(
      {
        status: "distributed",
        distributed_at: FieldValue.serverTimestamp(),
        distribution_log: `Logged ${rewardType} (${rewardLabel}) for downstream distribution.`
      },
      { merge: true }
    );
  }
);
