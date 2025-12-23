import type { Metadata } from "next";
import "../styles/styles.scss";

import HeaderNav from "@/components/HeaderNav";

export const metadata: Metadata = {
  title: "Creatives Guide Us",
  description: "Boutique web, music, and writing studio portfolio."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="cg-body">
        <HeaderNav />
        {children}
      </body>
    </html>
  );
}
