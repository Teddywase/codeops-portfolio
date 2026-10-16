import "server-only";

import { cookies } from "next/headers";
import {
  createSession,
  deleteSession,
  getSessionByToken,
} from "../../db";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "./session-cookie";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return token ? getSessionByToken(token) : null;
}

export async function startSession(userId) {
  const token = await createSession(userId);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, cookieOptions);
}

export async function endSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await deleteSession(token);
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}
