import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "johnwalls.studio | Interactive Sound Lab & Virtual DAW",
  description:
    "Modular Tube Amplifiers, Stompboxes, Roland SP-404 MKII Sampler, and Live Ableton Telemetry Console.",
  openGraph: {
    title: "johnwalls.studio | Interactive Sound Lab",
    description: "Modular Tube Amplifiers, Stompboxes, Roland SP-404 MKII Sampler, and Live Ableton Telemetry Console.",
    url: "https://johnwalls.studio/app"
  }
};

export default function StudioAppPage() {
  const studioAppPath = path.join(process.cwd(), "public", "studio-app", "index.html");
  const isDeployed = fs.existsSync(studioAppPath);

  let manifest: Record<string, unknown> | null = null;
  const manifestPath = path.join(process.cwd(), "public", "studio-app", "deploy-manifest.json");
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    } catch {}
  }

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", background: "#07080c", overflow: "hidden", color: "#f8fafc" }}>
      {/* Top minimal header ribbon */}
      <header
        style={{
          height: "42px",
          background: "#0c0f17",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.25rem",
          fontSize: "12px",
          fontFamily: "ui-monospace, monospace",
          zIndex: 40,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#e0b974", boxShadow: "0 0 8px #e0b974" }} />
            <span style={{ fontWeight: 800, letterSpacing: "0.08em", color: "#ffffff" }}>
              JOHNWALLS<span style={{ color: "#e0b974" }}>.STUDIO</span>
            </span>
          </div>
          <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>|</span>
          <span style={{ color: "#94a3b8", fontSize: "11px" }}>INTERACTIVE SOUND LAB &amp; VIRTUAL DAW</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {Boolean(manifest?.version) && (
            <span style={{ fontSize: "10.5px", color: "#64748b", background: "rgba(255, 255, 255, 0.04)", padding: "2px 8px", borderRadius: "4px" }}>
              Build: {String(manifest?.version)}
            </span>
          )}

          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "3px 10px",
              borderRadius: "5px",
              background: "rgba(224, 185, 116, 0.15)",
              color: "#e0b974",
              border: "1px solid rgba(224, 185, 116, 0.35)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "11.5px",
            }}
          >
            ← Back to Sound Archive
          </Link>
        </div>
      </header>

      {/* Main App Container */}
      <main style={{ flex: 1, position: "relative", width: "100%", height: "calc(100vh - 42px)", background: "#050609" }}>
        {isDeployed ? (
          <iframe
            src="/studio-app/index.html"
            title="johnwalls.studio Web Application"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
            allow="microphone; midi; autoplay"
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(224, 185, 116, 0.12)",
                border: "1px solid rgba(224, 185, 116, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#e0b974",
                fontSize: "20px",
                marginBottom: "1rem",
              }}
            >
              ⚡
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 10px 0" }}>
              johnwalls.studio Web Engine Ready for Push
            </h1>
            <p style={{ maxWidth: "520px", color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 1.5rem 0" }}>
              The auto-deployer route <code>/api/johnwalls/deploy</code> is active. Run auto-push from your local workstation to deploy the production web bundle here instantly.
            </p>
            <div
              style={{
                background: "#0c0f17",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: "1rem 1.5rem",
                fontFamily: "ui-monospace, monospace",
                fontSize: "12px",
                color: "#e0b974",
              }}
            >
              cd johnwalls_studio &amp;&amp; make push
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
