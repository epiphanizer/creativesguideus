import { addDoc, collection, getDocs, limit, orderBy, query } from "firebase/firestore";

import type { EcosystemLead, EcosystemLeadInput } from "@/lib/admin/types";

import { firebaseDb } from "./client";
import { firebaseAdminPaths } from "./config";

function getEcosystemLeadsCollection() {
  if (!firebaseDb) {
    throw new Error("Firestore is not initialized for this Firebase project.");
  }

  return collection(firebaseDb, firebaseAdminPaths.ecosystemLeadsCollection);
}

function normalizeLeadEmail(value: string) {
  return value.trim().toLowerCase();
}

function isValidLeadEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeLeadName(value?: string) {
  return (value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 80);
}

function normalizeLeadMeta(value: string, maxLength: number) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

function mapLeadDocument(id: string, data: Partial<Omit<EcosystemLead, "id">>) {
  return {
    id,
    email: typeof data.email === "string" ? data.email : "",
    fullName: typeof data.fullName === "string" ? data.fullName : "",
    source: typeof data.source === "string" ? data.source : "",
    interest: typeof data.interest === "string" ? data.interest : "",
    createdAt: typeof data.createdAt === "string" ? data.createdAt : "",
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
    status: data.status === "new" ? data.status : "new",
    consent: data.consent === true
  } satisfies EcosystemLead;
}

export async function createEcosystemLead(input: EcosystemLeadInput) {
  const email = normalizeLeadEmail(input.email);

  if (!isValidLeadEmail(email)) {
    throw new Error("Please enter a valid email address.");
  }

  const fullName = normalizeLeadName(input.fullName);
  const source = normalizeLeadMeta(input.source, 80);
  const interest = normalizeLeadMeta(input.interest, 120);

  if (!source || !interest) {
    throw new Error("Lead source metadata is incomplete.");
  }

  const timestamp = new Date().toISOString();
  const payload = {
    email,
    fullName,
    source,
    interest,
    createdAt: timestamp,
    updatedAt: timestamp,
    status: "new",
    consent: true
  } satisfies Omit<EcosystemLead, "id">;

  const docRef = await addDoc(getEcosystemLeadsCollection(), payload);

  return mapLeadDocument(docRef.id, payload);
}

export async function getEcosystemLeads(limitCount = 24) {
  const leadsQuery = query(getEcosystemLeadsCollection(), orderBy("createdAt", "desc"), limit(limitCount));
  const snapshot = await getDocs(leadsQuery);

  return snapshot.docs.map((docSnapshot) => mapLeadDocument(docSnapshot.id, docSnapshot.data() as Partial<Omit<EcosystemLead, "id">>));
}