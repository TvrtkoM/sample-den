"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function signOutAction() {
  await auth.api.signOut({ headers: await headers() });
}

export async function signInAction(email: string, password: string) {
  await auth.api.signInEmail({
    body: { email, password },
    headers: await headers()
  });
}
