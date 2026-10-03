"use client";

import type { ReactNode } from "react";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import ContactIntakeLayer from "@/components/contact/ContactIntakeLayer";
import { Footer } from "@/components/Footer";
import HeaderNav from "@/components/HeaderNav";
import PortableListeningRoom from "@/components/walls-devine/PortableListeningRoom";
import PenInkDripCursor from "@/components/ui/PenInkDripCursor";

export default function GlobalChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isStandaloneHost, setIsStandaloneHost] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname.toLowerCase();
      if (host.includes("johnwalls.rocks") || host.includes("johnwalls.studio")) {
        setIsStandaloneHost(true);
      }
    }
  }, []);

  const isAdminRoute = pathname?.startsWith("/admin") ?? false;
  const isStandaloneDomainRoute =
    pathname?.startsWith("/johnwalls-") ||
    pathname === "/rocks" ||
    pathname === "/studio" ||
    isStandaloneHost;

  const showStandardChrome = !isAdminRoute && !isStandaloneDomainRoute;

  return (
    <>
      {!isAdminRoute ? <PenInkDripCursor /> : null}
      {showStandardChrome ? <HeaderNav /> : null}
      {children}
      {showStandardChrome ? <Footer /> : null}
      {showStandardChrome ? <PortableListeningRoom /> : null}
      {showStandardChrome ? (
        <Suspense fallback={null}>
          <ContactIntakeLayer />
        </Suspense>
      ) : null}
    </>
  );
}