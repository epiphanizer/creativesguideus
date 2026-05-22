import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated, onDocumentWritten } from "firebase-functions/v2/firestore";
import { GoogleAuth, google } from "googleapis";

initializeApp();

const firestore = getFirestore();
const googleCalendarId = process.env.GOOGLE_CALENDAR_ID ?? "";
const googleCalendarChannelToken = process.env.GOOGLE_CALENDAR_CHANNEL_TOKEN ?? "";
const googleCalendarScope = ["https://www.googleapis.com/auth/calendar"];
const releaseTasksCollectionPath = "releaseTasks";
const bookingRoutingTasksCollectionPath = "bookingRoutingTasks";
const adminProjectDocPath = "adminProjects/walls-devine";

/**
 * Google Calendar prerequisites:
 * 1. Enable the Google Calendar API in the linked Google Cloud project.
 * 2. Grant the Firebase Functions service account Editor or Make changes to events access on the target calendar.
 * 3. Set GOOGLE_CALENDAR_ID to the target calendar ID.
 * 4. Register the webhook endpoint from onGoogleCalendarWebhook with calendar.events.watch and pass a token that matches GOOGLE_CALENDAR_CHANNEL_TOKEN.
 * 5. Keep extendedProperties.private.firestoreId on every synced event so inbound updates can map back to Firestore.
 */

function getCalendarClient() {
  const auth = new GoogleAuth({
    scopes: googleCalendarScope
  });

  return google.calendar({
    version: "v3",
    auth
  });
}

function normalizeReleaseTaskPayload(data = {}, taskId) {
  return {
    id: taskId,
    phase: typeof data.phase === "string" ? data.phase : "Release desk",
    summary: typeof data.summary === "string" ? data.summary : typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : typeof data.notes === "string" ? data.notes : "",
    start: typeof data.start === "string" ? data.start : "",
    end: typeof data.end === "string" ? data.end : typeof data.start === "string" ? data.start : "",
    completed: Boolean(data.completed),
    notes: typeof data.notes === "string" ? data.notes : "",
    gCalEventId: typeof data.gCalEventId === "string" && data.gCalEventId ? data.gCalEventId : null,
    syncSource: typeof data.syncSource === "string" ? data.syncSource : "admin-ui"
  };
}

function isAllDayDate(value = "") {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function shiftDateString(value, dayDelta) {
  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  date.setUTCDate(date.getUTCDate() + dayDelta);
  return date.toISOString().slice(0, 10);
}

function buildCalendarBoundary(value, isEnd = false) {
  if (isAllDayDate(value)) {
    return {
      date: isEnd ? shiftDateString(value, 1) : value
    };
  }

  return {
    dateTime: value
  };
}

function getCalendarBoundaryValue(boundary, isEnd = false) {
  if (boundary?.dateTime) {
    return boundary.dateTime;
  }

  if (boundary?.date) {
    return isEnd ? shiftDateString(boundary.date, -1) : boundary.date;
  }

  return "";
}

function buildExtendedProperties(firestoreId, syncCollection, extraPrivate = {}) {
  return {
    private: {
      firestoreId,
      syncCollection,
      ...extraPrivate
    }
  };
}

function buildCalendarEventPayload(task) {
  const descriptionLines = [task.description, task.notes ? `Notes: ${task.notes}` : "", `Phase: ${task.phase}`, `Status: ${task.completed ? "Complete" : "Open"}`].filter(Boolean);

  return {
    summary: task.summary,
    description: descriptionLines.join("\n\n"),
    start: buildCalendarBoundary(task.start),
    end: buildCalendarBoundary(task.end, true),
    extendedProperties: buildExtendedProperties(task.id, releaseTasksCollectionPath)
  };
}

function normalizeBookingRoutingPayload(data = {}, taskId) {
  const status = data.status === "confirmed" ? "confirmed" : "hold";
  const targetName = typeof data.targetName === "string" ? data.targetName : typeof data.name === "string" ? data.name : "";
  const market = typeof data.market === "string" ? data.market : [data.city, data.state].filter(Boolean).join(", ");
  const prefix = status === "confirmed" ? "[TOUR CONFIRMED]" : "[TOUR HOLD]";

  return {
    id: taskId,
    targetId: typeof data.targetId === "string" ? data.targetId : taskId,
    targetName,
    market,
    city: typeof data.city === "string" ? data.city : "",
    state: typeof data.state === "string" ? data.state : "",
    status,
    summary: typeof data.summary === "string" && data.summary ? data.summary : `${prefix} ${targetName}${market ? ` • ${market}` : ""}`,
    description: typeof data.description === "string" ? data.description : `Tour routing for ${targetName}`,
    start: typeof data.start === "string" ? data.start : "",
    end: typeof data.end === "string" ? data.end : typeof data.start === "string" ? data.start : "",
    notes: typeof data.notes === "string" ? data.notes : "",
    gCalEventId: typeof data.gCalEventId === "string" && data.gCalEventId ? data.gCalEventId : null,
    syncSource: typeof data.syncSource === "string" ? data.syncSource : "admin-ui"
  };
}

function buildBookingRoutingEventPayload(task) {
  const prefix = task.status === "confirmed" ? "[TOUR CONFIRMED]" : "[TOUR HOLD]";
  const descriptionLines = [task.description, task.notes ? `Notes: ${task.notes}` : "", task.market ? `Market: ${task.market}` : "", `Status: ${task.status === "confirmed" ? "Confirmed" : "Hold"}`].filter(Boolean);

  return {
    summary: task.summary || `${prefix} ${task.targetName}${task.market ? ` • ${task.market}` : ""}`,
    description: descriptionLines.join("\n\n"),
    start: buildCalendarBoundary(task.start),
    end: buildCalendarBoundary(task.end, true),
    extendedProperties: buildExtendedProperties(task.id, bookingRoutingTasksCollectionPath, {
      bookingStatus: task.status
    })
  };
}

function hasMeaningfulTaskChange(beforeData = null, afterData = null) {
  if (!beforeData && afterData) {
    return true;
  }

  if (beforeData && !afterData) {
    return true;
  }

  const trackedFields = ["summary", "description", "start", "end", "completed", "notes", "phase"];
  return trackedFields.some((field) => beforeData?.[field] !== afterData?.[field]);
}

function hasMeaningfulBookingRoutingChange(beforeData = null, afterData = null) {
  if (!beforeData && afterData) {
    return true;
  }

  if (beforeData && !afterData) {
    return true;
  }

  const trackedFields = ["targetName", "market", "status", "summary", "description", "start", "end", "notes"];
  return trackedFields.some((field) => beforeData?.[field] !== afterData?.[field]);
}

async function getReleaseTaskSyncState() {
  const snapshot = await firestore.doc(adminProjectDocPath).get();
  return snapshot.get("googleCalendarSync") ?? {};
}

async function setReleaseTaskSyncState(patch) {
  await firestore.doc(adminProjectDocPath).set(
    {
      googleCalendarSync: patch
    },
    { merge: true }
  );
}

async function listChangedCalendarEvents(calendarClient) {
  const syncState = await getReleaseTaskSyncState();

  try {
    const response = await calendarClient.events.list(
      syncState.syncToken
        ? {
            calendarId: googleCalendarId,
            syncToken: syncState.syncToken,
            singleEvents: true,
            showDeleted: true,
            maxResults: 2500
          }
        : {
            calendarId: googleCalendarId,
            timeMin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
            singleEvents: true,
            showDeleted: true,
            orderBy: "updated",
            maxResults: 2500
          }
    );

    return {
      events: response.data.items ?? [],
      nextSyncToken: response.data.nextSyncToken ?? syncState.syncToken ?? null
    };
  } catch (error) {
    const status = error?.response?.status;

    if (status === 410) {
      logger.warn("Google Calendar sync token expired. Resetting to a fresh time-based sync.");
      await setReleaseTaskSyncState({
        syncToken: null,
        resetAt: FieldValue.serverTimestamp()
      });

      const fallbackResponse = await calendarClient.events.list({
        calendarId: googleCalendarId,
        timeMin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
        singleEvents: true,
        showDeleted: true,
        orderBy: "updated",
        maxResults: 2500
      });

      return {
        events: fallbackResponse.data.items ?? [],
        nextSyncToken: fallbackResponse.data.nextSyncToken ?? null
      };
    }

    throw error;
  }
}

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
    const walletAddress = typeof claimData.wallet_address === "string" ? claimData.wallet_address : "";
    const distributionMode = typeof claimData.distribution_mode === "string" ? claimData.distribution_mode : "direct";
    const airdropKey = typeof claimData.airdrop_key === "string" ? claimData.airdrop_key : "";

    logger.info("Processing ecosystem reward claim.", {
      claimId,
      rewardId,
      rewardType,
      rewardLabel,
      chapter,
      distributionMode,
      airdropKey,
      walletAddress
    });

    await firestore.collection("rewardDispatchLogs").doc(claimId).set({
      claim_ref: snapshot.ref,
      reward_id: rewardId,
      reward_type: rewardType,
      reward_label: rewardLabel,
      chapter,
      wallet_address: walletAddress,
      distribution_mode: distributionMode,
      airdrop_key: airdropKey,
      logged_at: FieldValue.serverTimestamp(),
      status: "logged_for_distribution"
    });

    await snapshot.ref.set(
      {
        status: "distributed",
        distributed_at: FieldValue.serverTimestamp(),
        distribution_log: distributionMode === "airdrop"
          ? `Logged ${rewardType} (${rewardLabel}) for wallet-aware downstream distribution.`
          : `Logged ${rewardType} (${rewardLabel}) for downstream distribution.`
      },
      { merge: true }
    );
  }
);

export const onReleaseTaskWritten = onDocumentWritten(
  {
    document: `${releaseTasksCollectionPath}/{taskId}`,
    region: "us-central1"
  },
  async (event) => {
    if (!googleCalendarId) {
      logger.warn("Skipping release task sync because GOOGLE_CALENDAR_ID is not configured.");
      return;
    }

    const beforeData = event.data?.before.exists ? event.data.before.data() : null;
    const afterData = event.data?.after.exists ? event.data.after.data() : null;
    const taskId = event.params.taskId;
    const calendarClient = getCalendarClient();

    if (!afterData) {
      const previousTask = normalizeReleaseTaskPayload(beforeData, taskId);

      if (previousTask.gCalEventId) {
        await calendarClient.events.delete({
          calendarId: googleCalendarId,
          eventId: previousTask.gCalEventId
        });
      }

      logger.info("Deleted Google Calendar event for release task.", { taskId, eventId: previousTask.gCalEventId });
      return;
    }

    const nextTask = normalizeReleaseTaskPayload(afterData, taskId);

    if (nextTask.syncSource === "gcal-webhook") {
      logger.info("Skipping outbound release task sync because the change came from the webhook.", { taskId });
      return;
    }

    if (!hasMeaningfulTaskChange(beforeData, afterData)) {
      logger.info("Skipping outbound release task sync because no calendar-facing fields changed.", { taskId });
      return;
    }

    if (!nextTask.summary || !nextTask.start || !nextTask.end) {
      logger.warn("Release task is missing Google Calendar fields. Skipping sync.", {
        taskId,
        summary: nextTask.summary,
        start: nextTask.start,
        end: nextTask.end
      });
      return;
    }

    const requestBody = buildCalendarEventPayload(nextTask);
    let eventId = nextTask.gCalEventId;

    if (!eventId) {
      const insertedEvent = await calendarClient.events.insert({
        calendarId: googleCalendarId,
        requestBody
      });
      eventId = insertedEvent.data.id ?? null;
      logger.info("Created Google Calendar event for release task.", { taskId, eventId });
    } else {
      await calendarClient.events.patch({
        calendarId: googleCalendarId,
        eventId,
        requestBody
      });
      logger.info("Updated Google Calendar event for release task.", { taskId, eventId });
    }

    await firestore.collection(releaseTasksCollectionPath).doc(taskId).set(
      {
        gCalEventId: eventId,
        syncSource: "calendar-sync",
        lastSyncedAt: FieldValue.serverTimestamp(),
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  }
);

export const onBookingRoutingTaskWritten = onDocumentWritten(
  {
    document: `${bookingRoutingTasksCollectionPath}/{targetId}`,
    region: "us-central1"
  },
  async (event) => {
    if (!googleCalendarId) {
      logger.warn("Skipping booking routing sync because GOOGLE_CALENDAR_ID is not configured.");
      return;
    }

    const beforeData = event.data?.before.exists ? event.data.before.data() : null;
    const afterData = event.data?.after.exists ? event.data.after.data() : null;
    const targetId = event.params.targetId;
    const calendarClient = getCalendarClient();

    if (!afterData) {
      const previousTask = normalizeBookingRoutingPayload(beforeData, targetId);

      if (previousTask.gCalEventId) {
        await calendarClient.events.delete({
          calendarId: googleCalendarId,
          eventId: previousTask.gCalEventId
        });
      }

      logger.info("Deleted Google Calendar event for booking routing task.", { targetId, eventId: previousTask.gCalEventId });
      return;
    }

    const nextTask = normalizeBookingRoutingPayload(afterData, targetId);

    if (nextTask.syncSource === "gcal-webhook") {
      logger.info("Skipping outbound booking routing sync because the change came from the webhook.", { targetId });
      return;
    }

    if (!hasMeaningfulBookingRoutingChange(beforeData, afterData)) {
      logger.info("Skipping outbound booking routing sync because no calendar-facing fields changed.", { targetId });
      return;
    }

    if (!nextTask.targetName || !nextTask.start || !nextTask.end) {
      logger.warn("Booking routing task is missing Google Calendar fields. Skipping sync.", {
        targetId,
        targetName: nextTask.targetName,
        start: nextTask.start,
        end: nextTask.end
      });
      return;
    }

    const requestBody = buildBookingRoutingEventPayload(nextTask);
    let eventId = nextTask.gCalEventId;

    if (!eventId) {
      const insertedEvent = await calendarClient.events.insert({
        calendarId: googleCalendarId,
        requestBody
      });
      eventId = insertedEvent.data.id ?? null;
      logger.info("Created Google Calendar event for booking routing task.", { targetId, eventId });
    } else {
      await calendarClient.events.patch({
        calendarId: googleCalendarId,
        eventId,
        requestBody
      });
      logger.info("Updated Google Calendar event for booking routing task.", { targetId, eventId });
    }

    await firestore.collection(bookingRoutingTasksCollectionPath).doc(targetId).set(
      {
        summary: requestBody.summary,
        gCalEventId: eventId,
        syncSource: "calendar-sync",
        lastSyncedAt: FieldValue.serverTimestamp(),
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  }
);

export const onGoogleCalendarWebhook = onRequest(
  {
    region: "us-central1"
  },
  async (request, response) => {
    if (!googleCalendarId) {
      logger.warn("Google Calendar webhook hit without GOOGLE_CALENDAR_ID configured.");
      response.status(500).send("Missing GOOGLE_CALENDAR_ID.");
      return;
    }

    if (googleCalendarChannelToken) {
      const inboundToken = request.header("x-goog-channel-token");

      if (inboundToken !== googleCalendarChannelToken) {
        logger.warn("Rejected Google Calendar webhook with invalid channel token.");
        response.status(401).send("Invalid channel token.");
        return;
      }
    }

    if (request.method === "GET") {
      response.status(200).send("Google Calendar webhook ready.");
      return;
    }

    const resourceState = request.header("x-goog-resource-state") ?? "unknown";
    logger.info("Google Calendar webhook received.", {
      resourceState,
      channelId: request.header("x-goog-channel-id") ?? null,
      resourceId: request.header("x-goog-resource-id") ?? null
    });

    const calendarClient = getCalendarClient();
    const { events, nextSyncToken } = await listChangedCalendarEvents(calendarClient);

    for (const eventItem of events) {
      const firestoreId = eventItem.extendedProperties?.private?.firestoreId;
      const syncCollection = eventItem.extendedProperties?.private?.syncCollection ?? releaseTasksCollectionPath;

      if (!firestoreId || (syncCollection !== releaseTasksCollectionPath && syncCollection !== bookingRoutingTasksCollectionPath)) {
        continue;
      }

      const documentRef = firestore.collection(syncCollection).doc(firestoreId);

      if (eventItem.status === "cancelled") {
        await documentRef.set(
          {
            gCalEventId: null,
            syncSource: "gcal-webhook",
            updatedAt: new Date().toISOString(),
            lastWebhookSyncedAt: FieldValue.serverTimestamp()
          },
          { merge: true }
        );
        continue;
      }

      if (syncCollection === bookingRoutingTasksCollectionPath) {
        const bookingStatus = eventItem.extendedProperties?.private?.bookingStatus === "confirmed" || eventItem.summary?.startsWith("[TOUR CONFIRMED]")
          ? "confirmed"
          : "hold";

        await documentRef.set(
          {
            summary: eventItem.summary ?? "",
            status: bookingStatus,
            start: getCalendarBoundaryValue(eventItem.start),
            end:
              getCalendarBoundaryValue(eventItem.end, true) ||
              getCalendarBoundaryValue(eventItem.start),
            gCalEventId: eventItem.id ?? null,
            syncSource: "gcal-webhook",
            updatedAt: new Date().toISOString(),
            lastWebhookSyncedAt: FieldValue.serverTimestamp()
          },
          { merge: true }
        );
        continue;
      }

      await documentRef.set(
        {
          summary: eventItem.summary ?? "Untitled release task",
          description: eventItem.description ?? "",
          start: getCalendarBoundaryValue(eventItem.start),
          end: getCalendarBoundaryValue(eventItem.end, true) || getCalendarBoundaryValue(eventItem.start),
          gCalEventId: eventItem.id ?? null,
          syncSource: "gcal-webhook",
          updatedAt: new Date().toISOString(),
          lastWebhookSyncedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
    }

    await setReleaseTaskSyncState({
      syncToken: nextSyncToken,
      lastWebhookAt: FieldValue.serverTimestamp(),
      lastResourceState: resourceState
    });

    response.status(200).send("Calendar sync processed.");
  }
);

export const enrichBookingContact = onCall(
  {
    region: "us-central1"
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Sign in before using booking contact enrichment.");
    }

    const targetName = typeof request.data?.targetName === "string" ? request.data.targetName.trim() : "";
    const market = typeof request.data?.market === "string" ? request.data.market.trim() : "";
    const category = typeof request.data?.category === "string" ? request.data.category.trim() : "";

    if (!targetName || !market) {
      throw new HttpsError("invalid-argument", "targetName and market are required.");
    }

    const searchQuery = `"${targetName}" "${market}" ("talent buyer" OR booking OR promoter OR "booking contact") (email OR contact)`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

    logger.info("Booking contact enrichment stub invoked.", {
      uid: request.auth.uid,
      targetName,
      market,
      category
    });

    // Future enrichment pipeline:
    // 1. Call a search API such as Serper or Google Custom Search with the structured query above.
    // 2. Pull the top result snippets, venue pages, and promoter/about pages into a small evidence bundle.
    // 3. Send that evidence to OpenAI or Gemini to extract likely booking emails, contact forms, and promoter names.
    // 4. Return ranked suggestions with confidence, source URLs, and a short "why this looks right" explanation.
    // 5. Persist accepted suggestions back into bookingBoard.targets[{targetId}].contacts once the admin confirms them.

    return {
      targetName,
      market,
      category,
      searchQuery,
      searchUrl,
      notes: [
        "Stub only: this currently returns a focused Google search URL.",
        "Next step is wiring a search API plus LLM extraction before suggesting verified contacts in the drawer."
      ]
    };
  }
);
