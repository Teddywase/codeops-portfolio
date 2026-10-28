# Addis Eats Project V-2 (Next.js)

This is day-01 of building Addis Eats website with Next.js

## Routes and Files

| Route       | File                    |
| ----------- | ----------------------- |
| `/`         | `app/page.js`           |
| `/cart`     | `app/cart/page.js`      |
| `/checkout` | `app/checkout/page.js`  |
| `/menu`     | `app/menu/page.js`      |
| `/dish`     | `app/menu/[id]/page.js` |
| `loading`   | `app/menu/loading.js`   |
| `error`     | `app/menu/error.js`     |
| `not-found` | `app/not-found.js`      |

## Metadata and SEO

Set `NEXT_PUBLIC_SITE_URL` to the deployed site's public origin before building.
The root layout uses it as `metadataBase`; canonical links, dish structured data,
`sitemap.xml`, and `robots.txt` use the same origin. The default is
`https://addiseats.et`, as used in the course exercise.

The home page and dish pages include JSON-LD generated from the restaurant and
menu data. Dish pages and their Open Graph images are generated from menu slugs.
Private account, order, checkout, cart, and staff routes are excluded from
crawling and the sitemap.

## Staff dashboard

Staff can sign in and open `/kitchen` to view order-value totals by delivery
neighborhood, seven days of order activity, and a sortable, paginated order
table. Charts are aggregated on the server; each chart also has an accessible
data table. New orders collect a neighborhood from the supported list in
`src/lib/schema.js`. Order values exclude cancelled orders and are not payment
revenue; this demo does not collect payments.

The dashboard is backed by the in-memory mock store, so account and order data
is cleared when the server process restarts.

## Delivery tracking and exports

Signed-in customers can open an order to see its delivery neighborhood on a
Leaflet map, live status updates over server-sent events, and an Addis-time
order timestamp. Map markers are illustrative neighborhood locations; this
demo does not collect courier GPS coordinates. The orders page can export the
customer's order history as a quoted CSV file.

## Run and verify

Install dependencies with `npm ci`, then run `npm run dev`. Before deploying,
run `npm run build` and `npm run start` to check the production build locally.
Set `NEXT_PUBLIC_SITE_URL` to the exact origin being tested; use
`http://localhost:3000` locally and the assigned deployment URL in Vercel.
Set `KITCHEN_STAFF_EMAIL` and a unique `KITCHEN_STAFF_PASSWORD` of at least
16 characters in the local, untracked `.env.local` file when staff access is
needed. Never add the password to `NEXT_PUBLIC_` variables or commit it.

The checkout uses a per-browser request ID and disables its submit button while
the action is pending. Repeated submissions with the same ID and order details
return the original order in the mock store. Keyboard focus is visible, and
interactive buttons and menu controls use touch targets of at least 44 pixels.

## Vercel deployment

Push the project to GitHub, import it into Vercel, configure
`NEXT_PUBLIC_SITE_URL`, `KITCHEN_STAFF_EMAIL`, and
`KITCHEN_STAFF_PASSWORD` separately for Preview and Production, then redeploy.
Verify keyboard-only navigation, phone-sized controls, checkout submission,
signed-out behavior, and menu previews on the deployed URL. Add the actual
verified URL here after deployment.

This project uses an in-memory mock store for accounts, sessions, and orders.
Vercel instances do not share that store and may discard it when they restart;
the demo is not ready for real customer accounts or orders until its store and
sessions use persistent backing services.