import { redirect } from "next/navigation";

import { seanhallsWorkHref } from "@/lib/studio-links";

export default function WorkIndexPage() {
  redirect(seanhallsWorkHref);
}
