import type { Metadata } from "next";

import { LinkHubLanding } from "@/components/link-hub/LinkHubLanding";

export const metadata: Metadata = {
  title: "Signal Links | Creatives Guide Us",
  description: "Curated jump links to the active CGU rooms, platforms, and direct studio routes."
};

export default function LinksPage() {
  return <LinkHubLanding />;
}