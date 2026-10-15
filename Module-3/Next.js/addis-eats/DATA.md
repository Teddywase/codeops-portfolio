# Client Data Fetching

This app uses SWR only for data that needs client-side revalidation. The menu,
dish details, and initial menu page remain server-rendered. SWR does not expose
a `staleTime` option: `dedupingInterval` controls how closely repeated requests
with the same key are coalesced, while focus and interval revalidation determine
when cached data is refreshed.

| Screen | Query key | Initial data | Refresh and cache policy |
| --- | --- | --- | --- |
| Menu search and paging | `/api/dishes?q=<term>&category=<category>&page=<page>`; omitted values are left out. The key is `null` for the unfiltered first page. | The first six dishes are fetched by the Server Component. SWR uses them directly when its key is `null`. | Debounced by 300 ms; `keepPreviousData` keeps the prior list visible while the new key loads. Requests are deduplicated for 60 seconds and revalidated on focus. No timer is needed because the menu is revalidated on the server hourly. |
| Order status | `/api/orders/<order-id>` | The owner-checked Server Component fetches the initial status and passes it to SWR as `fallbackData`. | Poll every five seconds and revalidate on focus. The five-second deduplication interval matches the polling cadence. The API returns only the order ID, status, and last-updated time. |

The menu API keeps its original unfiltered `GET /api/dishes` array response for
existing callers. Supplying a search, category, or page parameter returns a
paginated result with `items`, `page`, `pageSize`, `total`, and `totalPages`.
Page navigation is reflected in the `/menu?page=…` query string; search and
category filters are also shareable through that URL.
