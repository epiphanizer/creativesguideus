"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", padding: "3rem", textAlign: "center", background: "#0c0f17", color: "#f8fafc" }}>
        <h2>Something went wrong</h2>
        <p style={{ color: "#94a3b8" }}>{error?.message || "An unexpected error occurred."}</p>
        <button
          onClick={() => reset()}
          style={{
            marginTop: "1rem",
            padding: "8px 16px",
            background: "#e0b974",
            color: "#0f172a",
            fontWeight: 600,
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
