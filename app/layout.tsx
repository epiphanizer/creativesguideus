import type { Metadata } from "next";
import { Suspense } from "react";
import "../styles/styles.scss";

import AnalyticsBootstrap from "@/components/analytics/AnalyticsBootstrap";
import GlobalChrome from "@/components/GlobalChrome";

export const metadata: Metadata = {
  title: "Creatives Guide Us",
  description: "Boutique web, music, and writing studio portfolio."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="cg-body">
        <Suspense fallback={null}>
          <AnalyticsBootstrap />
        </Suspense>
        <GlobalChrome>{children}</GlobalChrome>
      </body>
    </html>
  );
}
