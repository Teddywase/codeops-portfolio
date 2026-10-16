import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "./lib/session-cookie";

export function proxy(request) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  if (sessionCookie?.value) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/signin", request.url);
  signInUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/checkout", "/orders/:path*"],
};
