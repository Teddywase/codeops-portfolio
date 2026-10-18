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