"use client";

import { usePathname } from "next/navigation";

import { songPostCards } from "@/components/walls-devine/content";
import { WallsDevinePlayer } from "@/components/walls-devine/WallsDevinePlayer";

export function PortableListeningRoom() {
  const pathname = usePathname();
  const shouldShowDockByDefault = pathname?.startsWith("/walls-devine") ?? false;

  return <WallsDevinePlayer tracks={songPostCards} showDockWhenCollapsed={shouldShowDockByDefault} />;
}

export default PortableListeningRoom;
