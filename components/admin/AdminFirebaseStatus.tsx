"use client";

import { firebaseAdminPaths, firebaseProjectInfo, hasFirebaseConfig } from "@/lib/firebase/config";
import { firebaseApp, firebaseAuth, firebaseDb, firebaseStorage } from "@/lib/firebase/client";

type AdminFirebaseStatusProps = {
  signedInEmail?: string | null;
  contentSource?: "pending" | "firebase" | "bootstrap";
  isAuthorized?: boolean;
  notice?: string;
};

export function AdminFirebaseStatus({ signedInEmail, contentSource = "pending", isAuthorized, notice }: AdminFirebaseStatusProps) {
  const isInitialized = Boolean(firebaseApp);
  const statusLabel = !isInitialized ? "Missing config" : isAuthorized ? "Live" : signedInEmail ? "Signed in" : "Configured";
  const remoteContentLabel =
    contentSource === "firebase"
      ? "Firestore doc + Storage content loaded"
      : contentSource === "bootstrap"
        ? "Using bootstrap fallback"
        : "Waiting for Firebase content";

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
          <strong>Editor</strong>
          <span>{signedInEmail ?? "Not signed in"}</span>
        </li>
        <li>
          <strong>Project</strong>
          <span>{firebaseProjectInfo.projectId}</span>
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
          <strong>Storage path</strong>
          <span>{firebaseAdminPaths.storageBasePath}</span>
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

      {notice ? <p className="cg-admin__helper">{notice}</p> : null}
    </article>
  );
}

export default AdminFirebaseStatus;