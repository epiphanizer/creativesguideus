"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { clearAdminSession, createAdminSession, hasAdminSession, verifyAdminCredentials } from "@/lib/admin/auth";
import { updateReleasePlanItem } from "@/lib/admin/walls-devine";

export async function loginAdmin(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminCredentials(username, password)) {
    redirect("/admin?error=invalid");
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin");
}

export async function toggleReleasePlanItem(formData: FormData) {
  if (!(await hasAdminSession())) {
    redirect("/admin");
  }

  const itemId = String(formData.get("itemId") ?? "");
  const nextCompleted = String(formData.get("nextCompleted") ?? "false") === "true";

  if (itemId) {
    await updateReleasePlanItem(itemId, nextCompleted);
    revalidatePath("/admin");
  }

  redirect("/admin");
}
