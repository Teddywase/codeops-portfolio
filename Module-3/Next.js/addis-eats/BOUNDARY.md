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
| `src/app/components/CheckoutForm.jsx` | Client | Validates delivery details, shows the demo order confirmation, and clears the cart. |
| `src/app/(pages)/menu/error.js` | Client | Next.js requires route error boundaries to be Client Components. |
| `src/app/(pages)/menu/loading.js` | Server | Supplies the route-level loading fallback while async server rendering is pending. |

Menu data is currently served by the in-memory server-only module at `src/lib/menu.js`; replace that data source with a database query when one is available. Cart items are persisted in browser `localStorage`. Checkout is a front-end demo and does not submit orders or collect payment. Menu loading and errors are handled by route-level `loading.js` and `error.js`, not fetch state in the menu page.

## `/menu` First Load JavaScript

Measured from a production build by summing the uncompressed sizes of the unique JavaScript files referenced by `.next/server/app/menu.html`:

| Before | After | Difference |
| ---: | ---: | ---: |
| 576,119 bytes | 581,504 bytes | +5,385 bytes (+0.93%) |

This starting version already rendered the menu in a Server Component and had no menu fetch hook or client-side menu state. Consequently, it did not have the client-heavy baseline assumed by the exercise; the category and cart interactions add a small amount of JavaScript instead of reducing the existing bundle. The production build completes with `/menu` statically rendered and revalidated hourly.
