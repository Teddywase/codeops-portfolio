"use server";

import { redirect } from "next/navigation";
import { authenticateUser } from "../../db";
import { endSession, startSession } from "../lib/session";
import { getSafeRedirectPath } from "../lib/safe-redirect";

export async function signIn(formData) {
  const destination = getSafeRedirectPath(formData.get("next"));
  const email = formData.get("email");
  const password = formData.get("password");
  const user = await authenticateUser(email, password);

  if (!user) {
    const signInUrl = new URL("/signin", "http://addis-eats.local");
    signInUrl.searchParams.set("next", destination);
    signInUrl.searchParams.set("error", "invalid-credentials");
    redirect(`${signInUrl.pathname}${signInUrl.search}`);
  }

  await endSession();
  await startSession(user.id);
  redirect(user.role === "staff" ? "/kitchen" : destination);
}

export async function signOut() {
  await endSession();
  redirect("/signin");
}
