import type { Metadata } from "next";

import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact | Creatives Guide Us",
  description: "Guided intake for bookings, release worlds, product systems, and collaboration inquiries."
};

export default function ContactPage() {
  return (
    <main className="cg-page cg-contact-page" id="hero">
      <ContactSection headingLevel="h1" />
    </main>
  );
}