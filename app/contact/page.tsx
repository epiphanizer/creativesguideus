import type { Metadata } from "next";

import { ContactSection } from "@/components/ContactSection";

type ContactPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function buildSearchString(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      for (const entry of value) {
        params.append(key, entry);
      }

      continue;
    }

    if (typeof value === "string") {
      params.set(key, value);
    }
  }

  return params.toString();
}

export const metadata: Metadata = {
  title: "Contact | Creatives Guide Us",
  description: "Guided intake for bookings, release worlds, product systems, and collaboration inquiries."
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="cg-page cg-contact-page" id="hero">
      <ContactSection headingLevel="h1" initialSearch={buildSearchString(resolvedSearchParams)} />
    </main>
  );
}