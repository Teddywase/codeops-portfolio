# Day 42: Middleware and Authentication

This guide maps each of the lesson's four sections to the running Addis Eats
application. This is a teaching implementation, not production authentication.

## 1. Middleware / Proxy

Next.js 16 calls the convention `proxy.js` (the lesson's `middleware.js` was
renamed). [`src/proxy.js`](./src/proxy.js) runs before matching routes and checks
only whether the session cookie exists. Its matcher is deliberately limited to
`/checkout` and `/orders/:path*`; public menu routes and static assets are not
intercepted. A missing cookie redirects to `/signin` and carries the requested
path in `next`.

Proxy code stays fast and does not query the session store: a cookie's presence
is not proof that the session is valid. The server verifies it later. A redirect
changes the browser URL, while a rewrite serves different content behind the
same URL; this app uses a visible redirect for sign-in.

## 2. Sessions and Cookies

Signing in follows the session sequence: submit credentials, verify the stored
scrypt password hash, create a random server-side session, set its token as a
cookie, resolve that cookie to a user on later requests, and delete the session
and cookie on sign-out. [`src/lib/session.js`](./src/lib/session.js) is the
shared server helper used by pages, actions, and handlers.

| Cookie option | Protection |
| --- | --- |
| `httpOnly` | Prevents page JavaScript from reading the session token |
| `secure` in production | Sends the cookie only over HTTPS |
| `sameSite: "lax"` | Helps prevent cross-site requests from carrying the cookie |

The token is not put in `localStorage`. This demo uses an opaque database-style
session: the server is authoritative and can revoke a token immediately, but it
must look up each session and the in-memory store is lost on restart. A signed
token (such as a JWT) avoids that lookup but is harder to revoke before expiry.
For real users, use a maintained auth library and a persistent store; this
exercise intentionally exposes the steps so they can be studied.

## 3. Protecting Routes and Data

There are three checks with different responsibilities. Proxy redirects early,
the page verifies the session before rendering private data, and an action or
handler verifies authentication and authorization at the point data changes.
Hiding a link is only a UI choice, never a security boundary.

The `/orders` page demonstrates a user-scoped query: it calls
`getOrdersFor(session.id)`. The database refuses an unscoped order-list query.
The order detail page and status API also check that the requested order belongs
to the signed-in user. Order placement derives its owner from the session;
cancellation checks both the session and order owner before changing status.
The client-supplied order ID is a lookup key, not proof of ownership.

The `next` destination is validated by
[`src/lib/safe-redirect.js`](./src/lib/safe-redirect.js). It rejects external
URLs, protocol-relative paths such as `//evil.example`, and backslashes before
redirecting, preventing open redirects.

## 4. Authentication in Practice

The `/kitchen` page reads the role from the verified server-side session and
returns not-found for a customer. The check is in the page, not just the
markup. Customer actions separately enforce owner checks where they write.

The public `/signup` page creates customer accounts only. Its server action
validates and normalizes the submitted name and email, rejects duplicate email
addresses, hashes passwords with scrypt and an individual random salt, and
starts an httpOnly session using the same session helper as sign-in. Submitted
redirect destinations are validated with `getSafeRedirectPath`.

### Protected surfaces

| Surface | Authentication | Authorization |
| --- | --- | --- |
| `/checkout` | Proxy and page-level session check | Signed-in user |
| `/orders` | Proxy and page-level session check | Query scoped to session user |
| `/orders/[id]` | Proxy and page-level session check | Order owner only |
| `POST /api/orders` | `createCustomerOrder()` | Order assigned to session user |
| `GET /api/orders/[id]` | `getSession()` | Order owner only |
| `placeOrder` server action | `createCustomerOrder()` | Order assigned to session user |
| `cancelOrder` server action | `getSession()` | Owner and pending status |
| `/kitchen` | `getSession()` | Staff role |

### Try the lesson's security checks

1. Visit `/checkout` or `/orders` while signed out; Proxy should send you to
   sign-in with a `next` path.
2. Create an account at `/signup`, verify it signs you in, and try signing up
   again with the same email using different letter casing; the second
   registration must be rejected.
3. Sign in as a customer and visit `/kitchen`; the server must deny access.
4. Sign in as staff and visit `/kitchen`; the server must allow access.
5. Sign in to separate browser profiles as the two customers, place an order
   under each account, and verify `/orders` shows only that account's orders.
   Opening the other account's order URL or polling its status API must not
   reveal its data.
6. Try `/signin?next=https%3A%2F%2Fevil.example`; after sign-in, the app must
   stay on this site and use the safe fallback instead.
7. Call `POST /api/orders` while signed out; it must return `401`. Calling a
   server action directly must still run the action's own session check.

### Review questions

1. Proxy redirects before rendering and data loading, so signed-out requests do
   less work than a client-side guard.
2. `httpOnly` blocks script access, `secure` requires HTTPS, and `sameSite`
   reduces cross-site cookie sending.
3. Database sessions can be revoked immediately; signed tokens avoid a lookup
   on each request.
4. Proxy only checks that a cookie exists. The action must validate the session
   and permissions because it is the security boundary for the write.
5. Filtering by the verified session user ID prevents a caller from selecting
   another account's orders by changing a request parameter.
6. An unchecked external `next` value enables an open redirect. Validate the
   destination and fall back to a local path.

## Demo accounts and limitations

There are no shared demo credentials. Customer accounts are created through
`/signup`. To enable a staff account locally, set `KITCHEN_STAFF_EMAIL` and a
unique `KITCHEN_STAFF_PASSWORD` (at least 16 characters) in the untracked
`.env.local` file; configure them as private environment variables in the
deployment platform. Do not expose the password in the sign-in page, source,
or a `NEXT_PUBLIC_` variable.

Registrations, staff accounts, sessions, and orders are stored in memory and
reset when the server restarts. Users, orders, and sessions are unsuitable for
production. Production authentication should use a maintained library,
persistent storage, HTTPS, rate limiting, recovery flows, and secure
operational session management.
