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