import type { ReactNode } from "react";

import { AdminAppShell } from "@/components/admin/AdminAppShell";
import { AdminProjectProvider } from "@/components/admin/AdminProjectProvider";
import { AdminWorkspaceProvider } from "@/components/admin/AdminWorkspaceProvider";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProjectProvider>
      <AdminWorkspaceProvider>
        <AdminAppShell>{children}</AdminAppShell>
      </AdminWorkspaceProvider>
    </AdminProjectProvider>
  );
}