import { addDoc, collection } from "firebase/firestore";

import { firebaseDb } from "./client";
import { firebaseAdminPaths } from "./config";

export type ContactIntakeInput = {
  name: string;
  email: string;
  company?: string;
  projectTitle?: string;
  brief: string;
  source: string;
  interest: string;
  contextId?: string;
  inquiryType?: string;
  inquiryTypeLabel?: string;
  goal?: string;
  goalLabel?: string;
  surface?: string;
  surfaceLabel?: string;
  engagement?: string;
  engagementLabel?: string;
  timeline?: string;
  timelineLabel?: string;
  budgetRange?: string;
  budgetRangeLabel?: string;
};

function getContactCollection() {
  if (!firebaseDb) {
    throw new Error("Firestore is not initialized for this Firebase project.");
  }

  return collection(firebaseDb, firebaseAdminPaths.ecosystemLeadsCollection);
}

function cleanString(value: string | undefined, maxLength: number) {
  return (value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

function cleanLongString(value: string | undefined, maxLength: number) {
  return (value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

function normalizeEmail(value: string | undefined) {
  return cleanString(value, 160).toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function createContactIntake(input: ContactIntakeInput) {
  const name = cleanString(input.name, 120);
  const email = normalizeEmail(input.email);
  const brief = cleanLongString(input.brief, 3000);
  const timestamp = new Date().toISOString();

  if (!name || !email || !brief) {
    throw new Error("Name, email, and a clear project note are required.");
  }

  if (!isValidEmail(email)) {
    throw new Error("Please enter a valid email address.");
  }

  const payload = {
    email,
    fullName: name,
    source: cleanString(input.source, 120),
    interest: cleanString(input.interest, 160) || "Guided intake",
    company: cleanString(input.company, 160),
    projectTitle: cleanString(input.projectTitle, 160),
    brief,
    contextId: cleanString(input.contextId, 120),
    inquiryType: cleanString(input.inquiryType, 80),
    inquiryTypeLabel: cleanString(input.inquiryTypeLabel, 120),
    goal: cleanString(input.goal, 80),
    goalLabel: cleanString(input.goalLabel, 120),
    surface: cleanString(input.surface, 80),
    surfaceLabel: cleanString(input.surfaceLabel, 120),
    engagement: cleanString(input.engagement, 80),
    engagementLabel: cleanString(input.engagementLabel, 120),
    timeline: cleanString(input.timeline, 80),
    timelineLabel: cleanString(input.timelineLabel, 120),
    budgetRange: cleanString(input.budgetRange, 80),
    budgetRangeLabel: cleanString(input.budgetRangeLabel, 120),
    createdAt: timestamp,
    updatedAt: timestamp,
    status: "new",
    consent: true
  };

  await addDoc(getContactCollection(), payload);
}