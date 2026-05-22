"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ContactIntakeModal from "@/components/contact/ContactIntakeModal";
import { hasContactModalIntent, stripContactModalSearch } from "@/lib/contact-intake-routing";

export function ContactIntakeLayer() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.toString();
  const isOpen = hasContactModalIntent(searchParams);

  const handleClose = useCallback(() => {
    const nextSearch = stripContactModalSearch(searchParams);
    router.replace(nextSearch ? `${pathname}?${nextSearch}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  return <ContactIntakeModal isOpen={isOpen} initialSearch={initialSearch} onClose={handleClose} />;
}

export default ContactIntakeLayer;