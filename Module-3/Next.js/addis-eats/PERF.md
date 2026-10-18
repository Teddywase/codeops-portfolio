# Day 43: Optimisation and Environment

## Lighthouse measurement: server-rendered menu before dish photos

Route: `/menu`  
Build: production (`npm run build`, served with `npm run start`)  
Audit: Lighthouse mobile, simulated throttling, one run before and one after the
server-rendered menu change. These measurements predate the dish photos being
added to the project.

| Metric | Before | After | Change |
| --- | ---: | ---: | ---: |
| Performance score | 88 | 92 | +4 points |
| Largest Contentful Paint | 2,885 ms | 2,756 ms | -128 ms |
| Cumulative Layout Shift | 0.00 | 0.00 | no change |
| Total Blocking Time | 313 ms | 235 ms | -78 ms |
| Transferred page bytes | 260,735 B | 252,295 B | -8,440 B |

The menu filters and pagination now submit GET requests and render on the
server. The category/search/list code no longer needs a hydrated client
component or SWR; the cart buttons remain interactive client components.
Search now applies on Enter or the Search button instead of updating after a
debounce. This intentionally trades live filtering for server rendering and
works without JavaScript. The audit showed reduced blocking time and transfer
size. LCP is still above the 2.5-second target, and single Lighthouse runs can
vary.

Reproduce the audit against a production server with:

```sh
npm exec --yes --package=lighthouse -- lighthouse http://127.0.0.1:3000/menu --only-categories=performance --form-factor=mobile --throttling-method=simulate
```

## Lighthouse measurement: optimized dish photos

After adding `next/image` to the menu and dish pages, a new production mobile
audit reported:

| Metric | With optimized dish photos |
| --- | ---: |
| Performance score | 89 |
| Largest Contentful Paint | 3,218 ms |
| Cumulative Layout Shift | 0.00 |
| Total Blocking Time | 211 ms |
| Transferred page bytes | 550,273 B |

The hero dish photo is discovered in the initial document, eagerly loaded, and
marked `fetchpriority="high"`; below-the-fold photos remain lazy. Lighthouse
confirmed all three LCP image-discovery checks pass. The first dish's original
736-pixel-wide JPEG was delivered at 640 pixels by the Next.js image optimizer.
Adding photographs increases total transferred bytes; LCP is now above the
2.5-second target, so measure again on representative devices and consider
smaller source images if image transfer is still the bottleneck.

Lighthouse's navigation audit does not produce an INP measurement without a
user interaction. Total Blocking Time is reported as a lab diagnostic, not as
a replacement for field INP. Check INP with real-user data or an interaction
flow on a representative device.

## Exercise findings and follow-up

- The root layout already uses `next/font/google` for Geist and Geist Mono.
  Both fonts are bundled and served by the app, use the Latin subset, and
  explicitly use `display: "swap"`.
- Menu cards and dish detail pages render the available local assets with
  `next/image`, responsive `sizes`, reserved aspect ratios, and dish-name alt
  text. Only the first visible menu image is prioritized; detail pages
  prioritize their single main dish image.
- The menu has no matching `beg-wet.jpg` in `public/assets`, so that optional
  photo is omitted rather than displaying an unrelated image. Add the matching
  file to enable it.
- No third-party scripts are currently needed. If one is added, load it with
  `next/script` and choose `lazyOnload` for non-critical analytics or widgets.
- The app reads no application-specific environment variables. `.env.example`
  records that fact; `.env.local` remains ignored, and the example file is
  explicitly allowed by `.gitignore`. `NODE_ENV` is managed by Next.js.

## Review questions

1. `width` and `height` reserve the image's aspect ratio before it loads, which
   prevents layout shift; CSS still controls its displayed size.
2. `sizes` tells the browser how wide the image will render so it can choose
   the appropriate `srcset` candidate. Without it, the browser may download a
   needlessly large image.
3. Give priority to the single largest image visible without scrolling. More
   priority images compete with one another for early bandwidth.
4. `next/font` serves the font from the app's origin; `display: "swap"` keeps
   text visible while loading, and Next.js provides a metric-matched fallback
   to limit layout shift.
5. A development score is not representative: development code is not
   production-optimized and compiles on demand. Measure a production build.
6. `NEXT_PUBLIC_*` values are bundled into client code at build time. A
   payment secret with that prefix is exposed and must be rotated; it cannot
   safely be treated as a secret.
