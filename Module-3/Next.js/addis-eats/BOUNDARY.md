# Server and Client Component Boundaries

| Component | Runs on | Reason |
| --- | --- | --- |
| `src/app/layout.js` | Server | Owns metadata and shared page chrome; it passes route content into `Providers`. |
| `src/app/providers.jsx` | Client | Owns the cart context, synchronizes it with browser storage, and exposes cart actions. |
| `src/app/components/CartLink.jsx` | Client | Shows the current cart item count in the shared header. |
| `src/app/(pages)/menu/page.js` | Server | Fetches the first six dishes and categories; the route remains ISR with a one-hour revalidation period. |
| `src/app/(pages)/menu/CategoryBar.jsx` | Client | Owns the category, debounced search, and page state; uses SWR to fetch filtered pages while retaining previous results. |
| `src/app/(pages)/menu/DishList.jsx` | Client | Renders the changing SWR result set and composes interactive add-to-cart buttons. |
| `src/app/(pages)/signin/page.js` | Server | Validates the active session, sanitizes the return destination, and renders sign-in/sign-out states. |
| `src/proxy.js` | Server | Redirects cookie-less requests for `/checkout` and `/orders` before rendering; the page and action checks remain authoritative. |
| `src/app/(pages)/orders/page.js` | Server | Requires a verified session and queries only the signed-in user's orders. |
| `src/app/(pages)/orders/[id]/page.js` | Server | Checks the mock session and order ownership, then seeds the client status poll with the current status. |
| `src/app/(pages)/kitchen/page.js` | Server | Checks the verified session's staff role before rendering the kitchen route. |
| `src/app/components/OrderStatus.jsx` | Client | Uses SWR to poll the owner-checked status endpoint every five seconds; server data avoids an initial loading state. |
| `src/app/components/AddToCartButton.jsx` | Client | Handles add-to-cart clicks and writes to the cart context. |
| `src/app/components/CartContents.jsx` | Client | Reads and updates cart state; the surrounding cart page remains a Server Component. |
| `src/app/components/CheckoutForm.jsx` | Client | Validates with the shared schema, submits through the order server action, displays pending/errors/confirmation, and lets the owner cancel. |
| `src/app/actions.js` | Server | Places orders and cancels pending orders after checking the mock session and record owner. |
| `src/app/api/dishes/route.js` | Server | Returns all dishes for legacy callers or a filtered, paged result for search, category, and page parameters. |
| `src/app/api/dishes/[id]/route.js` | Server | Returns one dish or a consistent 404 response. |
| `src/app/api/orders/route.js` | Server | Validates direct JSON order requests with the shared Zod schema and returns honest status codes. |
| `src/app/api/orders/[id]/route.js` | Server | Returns only status fields after verifying the signed-in mock session owns the order. |
| `src/lib/session.js` | Server-only | Reads, creates, and revokes the opaque session using the HTTP-only cookie and in-memory session store. |
| `src/lib/fetcher.js` | Client | Parses JSON responses and throws on non-success status codes for SWR. |
| `schema.js` | Shared | Defines and validates the order payload on both the client and server. |
| `db.js` | Server-only in this exercise | Supplies the mock dishes, orders, and session. |
| `src/app/(pages)/menu/error.js` | Client | Next.js requires route error boundaries to be Client Components. |
| `src/app/(pages)/menu/loading.js` | Server | Supplies the route-level loading fallback while async server rendering is pending. |

Menu data, demo users, orders, and database-style sessions use in-memory stores; orders and sessions are shared across server bundles and reset when the server process restarts. Passwords use scrypt verifiers, and the session token is held in an HTTP-only cookie, but this remains exercise-only authentication and is not suitable for deployment. The `/orders` query is scoped to the verified session user; order cancellation and status reads also verify the session and owner. Cart items are persisted in browser `localStorage`; checkout creates a demo order but does not collect payment. The browser uses the server action for checkout; `POST /api/orders` remains available to external clients and validates independently. Menu route loading and unexpected errors are handled by route-level `loading.js` and `error.js`; SWR retains existing results during client searches and page changes.

## `/menu` First Load JavaScript

Measured from a production build by summing the uncompressed sizes of the unique JavaScript files referenced by `.next/server/app/menu.html`:

| Stage | First Load JS | Change from previous stage |
| --- | ---: | ---: |
| Day 35 baseline | 576,119 bytes | — |
| Day 40 server-rendered menu | 581,504 bytes | +5,385 bytes (+0.93%) |
| Day 41 search and paging | 599,772 bytes | +18,268 bytes (+3.14%) |

The Day 40 version already rendered the initial menu in a Server Component and had no menu fetch hook. The Day 41 bundle grows because search, URL paging, and SWR need client code; the first six dishes still arrive in the server-rendered response. Order tracking is a separate dynamic route. The production build completes with `/menu` statically rendered and revalidated hourly.
