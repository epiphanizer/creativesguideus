import type { Metadata } from "next";
import { Suspense } from "react";
import "../styles/styles.scss";

import AnalyticsBootstrap from "@/components/analytics/AnalyticsBootstrap";
import GlobalChrome from "@/components/GlobalChrome";
import { getCguThemeBootstrapScript } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Creatives Guide Us",
  description: "Boutique web, music, and writing studio portfolio."
};

const themeBootstrapScript = getCguThemeBootstrapScript();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className="cg-body">
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <Suspense fallback={null}>
          <AnalyticsBootstrap />
        </Suspense>
        <GlobalChrome>{children}</GlobalChrome>
      </body>
    </html>
  );
}
