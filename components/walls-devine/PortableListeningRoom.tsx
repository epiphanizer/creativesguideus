"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { songPostCards } from "@/components/walls-devine/content";
import { WallsDevinePlayer } from "@/components/walls-devine/WallsDevinePlayer";

export function PortableListeningRoom() {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);
  const shouldShowDockByDefault = pathname?.startsWith("/walls-devine") ?? false;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <WallsDevinePlayer tracks={songPostCards} showDockWhenCollapsed={shouldShowDockByDefault} />;
}

export default PortableListeningRoom;
