"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function updateAuthRoutes() {
  revalidatePath("/sign-in");
}

export async function revalidateAuthRoutes() {
  revalidateTag("auth-routes", "max");
}

export async function redirectToHome() {
  "use server";

  redirect("/");
}
