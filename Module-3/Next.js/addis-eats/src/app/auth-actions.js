"use server";

import { redirect } from "next/navigation";
import { authenticateUser, registerUser } from "../lib/db";
import { signUpSchema } from "../lib/schema";
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

export async function signUp(formData) {
  const destination = getSafeRedirectPath(formData.get("next"));
  const result = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    redirect(
      `/signup?next=${encodeURIComponent(destination)}&error=invalid-input`,
    );
  }

  const user = await registerUser(
    result.data.name,
    result.data.email,
    result.data.password,
  );

  if (!user) {
    redirect(
      `/signup?next=${encodeURIComponent(destination)}&error=email-in-use`,
    );
  }

  await endSession();
  await startSession(user.id);
  redirect(destination);
}

export async function signOut() {
  await endSession();
  redirect("/signin");
}
