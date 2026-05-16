"use client";

import { firebaseAdminRecommendations, firebaseAdminPaths, firebaseProjectInfo, firebaseRoadmapNotes, hasFirebaseConfig } from "@/lib/firebase/config";
import { firebaseApp, firebaseAuth, firebaseDb, firebaseStorage } from "@/lib/firebase/client";

type AdminFirebaseStatusProps = {
  signedInEmail?: string | null;
  contentSource?: "pending" | "firebase" | "bootstrap";
  isAuthorized?: boolean;
};

export function AdminFirebaseStatus({ signedInEmail, contentSource = "pending", isAuthorized }: AdminFirebaseStatusProps) {
  const isInitialized = Boolean(firebaseApp);
  const statusLabel = !isInitialized ? "Missing config" : isAuthorized ? "Live" : signedInEmail ? "Signed in" : "Configured";
  const remoteContentLabel =
    contentSource === "firebase"
      ? "Firestore doc + Storage content loaded"
      : contentSource === "bootstrap"
        ? "Seeded into Firebase from local source files"
        : "Waiting for Firebase content";
  const notes = [...firebaseRoadmapNotes, ...firebaseAdminRecommendations];

  return (
    <article className="cg-admin__panel cg-admin__panel--firebase">
      <div className="cg-admin__status-row">
        <div>
          <h2>Firebase</h2>
          <p className="cg-admin__path-note">Project: {firebaseProjectInfo.projectId}</p>
        </div>
        <span
          className={[
            "cg-admin__status-badge",
            isInitialized ? "cg-admin__status-badge--ready" : "cg-admin__status-badge--pending"
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {isInitialized ? statusLabel : hasFirebaseConfig ? "Configured" : "Missing config"}
        </span>
      </div>

      <ul className="cg-admin__list">
        <li>
          <strong>Auth mode</strong>
          <span>{signedInEmail ? `Firebase email/password · ${signedInEmail}` : "Firebase email/password"}</span>
        </li>
        <li>
          <strong>Auth domain</strong>
          <span>{firebaseProjectInfo.authDomain}</span>
        </li>
        <li>
          <strong>Admin gate</strong>
          <span>{`${firebaseAdminPaths.adminUsersCollection}/{uid}`}</span>
        </li>
        <li>
          <strong>Project doc</strong>
          <span>{firebaseAdminPaths.adminProjectsCollection}/{firebaseAdminPaths.wallsDevineProjectId}</span>
        </li>
        <li>
          <strong>Storage bucket</strong>
          <span>{firebaseProjectInfo.storageBucket}</span>
        </li>
        <li>
          <strong>Client handles</strong>
          <span>
            Auth: {firebaseAuth ? "ready" : "pending"} · Firestore: {firebaseDb ? "ready" : "pending"} · Storage: {firebaseStorage ? "ready" : "pending"}
          </span>
        </li>
        <li>
          <strong>Remote content</strong>
          <span>{remoteContentLabel}</span>
        </li>
      </ul>

      <ul className="cg-admin__bullet-list">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </article>
  );
}

export default AdminFirebaseStatus;