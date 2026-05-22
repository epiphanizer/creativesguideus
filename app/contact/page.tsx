import type { Metadata } from "next";

import ContactLandingPage from "@/components/contact/ContactLandingPage";

export const metadata: Metadata = {
  title: "Contact | Creatives Guide Us",
  description: "Direct contact and the studio frame behind Walls/Devine, Bong Tour, Appreesh, and broader CGU systems work."
};

export default function ContactPage() {
  return <ContactLandingPage />;
}