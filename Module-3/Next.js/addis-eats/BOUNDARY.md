# Server and Client Component Boundaries

| Component | Runs on | Reason |
| --- | --- | --- |
| `src/app/layout.js` | Server | Owns metadata and shared page chrome; it passes route content into `Providers`. |
| `src/app/providers.jsx` | Client | Owns the cart context, synchronizes it with browser storage, and exposes cart actions. |
| `src/app/components/CartLink.jsx` | Client | Shows the current cart item count in the shared header. |
| `src/app/(pages)/menu/page.js` | Server | Awaits the server-only dish data and composes the menu. |
| `src/app/(pages)/menu/CategoryBar.jsx` | Client | Owns the selected category and receives the server-rendered `DishList` through `children`. It is both the category controls and the filter shell. |
| `src/app/(pages)/menu/DishList.jsx` | Server | Renders dish details and data attributes; small add-to-cart buttons are client leaves. |
| `src/app/components/AddToCartButton.jsx` | Client | Handles add-to-cart clicks and writes to the cart context. |
| `src/app/components/CartContents.jsx` | Client | Reads and updates cart state; the surrounding cart page remains a Server Component. |
| `src/app/components/CheckoutForm.jsx` | Client | Validates with the shared schema, submits through the order server action, displays pending/errors/confirmation, and lets the owner cancel. |
| `src/app/actions.js` | Server | Places orders and cancels pending orders after checking the mock session and record owner. |
| `src/app/api/dishes/route.js` | Server | Returns the available dishes as JSON. |
| `src/app/api/dishes/[id]/route.js` | Server | Returns one dish or a consistent 404 response. |
| `src/app/api/orders/route.js` | Server | Validates direct JSON order requests with the shared Zod schema and returns honest status codes. |
| `schema.js` | Shared | Defines and validates the order payload on both the client and server. |
| `db.js` | Server-only in this exercise | Supplies the mock dishes, orders, and session. |
| `src/app/(pages)/menu/error.js` | Client | Next.js requires route error boundaries to be Client Components. |
| `src/app/(pages)/menu/loading.js` | Server | Supplies the route-level loading fallback while async server rendering is pending. |

Menu and API data use the same in-memory mock database in `db.js`; orders reset when the server process restarts. The mock session is for this exercise only and is not real authentication. Order cancellation verifies the session and order owner inside the server action. Cart items are persisted in browser `localStorage`; checkout creates a demo order but does not collect payment. The browser uses the server action for checkout; `POST /api/orders` remains available to external clients and validates independently. Menu loading and errors are handled by route-level `loading.js` and `error.js`, not fetch state in the menu page.

## `/menu` First Load JavaScript

Measured from a production build by summing the uncompressed sizes of the unique JavaScript files referenced by `.next/server/app/menu.html`:

| Before | After | Difference |
| ---: | ---: | ---: |
| 576,119 bytes | 581,504 bytes | +5,385 bytes (+0.93%) |

This starting version already rendered the menu in a Server Component and had no menu fetch hook or client-side menu state. Consequently, it did not have the client-heavy baseline assumed by the exercise; the category and cart interactions add a small amount of JavaScript instead of reducing the existing bundle. The production build completes with `/menu` statically rendered and revalidated hourly.
