import type { Metadata } from "next";
import { Suspense } from "react";
import "../styles/styles.scss";

import AnalyticsBootstrap from "@/components/analytics/AnalyticsBootstrap";
import GlobalChrome from "@/components/GlobalChrome";

export const metadata: Metadata = {
  title: "Creatives Guide Us",
  description: "Independent creative studio & record label. Sound, screen, and tactile editions."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="cg-body">
        <Suspense fallback={null}>
          <AnalyticsBootstrap />
        </Suspense>
        <GlobalChrome>{children}</GlobalChrome>
      </body>
    </html>
  );
}
