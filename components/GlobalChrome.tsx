"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { usePathname } from "next/navigation";

import ContactIntakeLayer from "@/components/contact/ContactIntakeLayer";
import { Footer } from "@/components/Footer";
import HeaderNav from "@/components/HeaderNav";
import PortableListeningRoom from "@/components/walls-devine/PortableListeningRoom";
import PenInkDripCursor from "@/components/ui/PenInkDripCursor";

export default function GlobalChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  return (
    <>
      {!isAdminRoute ? <PenInkDripCursor /> : null}
      {!isAdminRoute ? <HeaderNav /> : null}
      {children}
      {!isAdminRoute ? <Footer /> : null}
      {!isAdminRoute ? <PortableListeningRoom /> : null}
      {!isAdminRoute ? (
        <Suspense fallback={null}>
          <ContactIntakeLayer />
        </Suspense>
      ) : null}
    </>
  );
}