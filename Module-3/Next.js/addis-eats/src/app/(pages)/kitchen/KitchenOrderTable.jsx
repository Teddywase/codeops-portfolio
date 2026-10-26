import Link from "next/link";
import { formatDate, formatEtb } from "../../../lib/format";
import styles from "./kitchen.module.css";

const columns = [
  { key: "createdAt", label: "Placed" },
  { key: "name", label: "Customer" },
  { key: "neighborhood", label: "Neighborhood" },
  { key: "status", label: "Status" },
  { key: "total", label: "Total (ETB)", numeric: true },
];

function getSortHref(key, currentSort, direction) {
  const nextDirection =
    currentSort === key && direction === "asc" ? "desc" : "asc";
  const query = new URLSearchParams({ sort: key, dir: nextDirection });
  return `/kitchen?${query.toString()}`;
}

function getPageHref(page, sort, direction) {
  const query = new URLSearchParams({
    page: String(page),
    sort,
    dir: direction,
  });
  return `/kitchen?${query.toString()}`;
}

export default function KitchenOrderTable({
  orders,
  total,
  page,
  totalPages,
  sort,
  direction,
}) {
  const visiblePages = Array.from(
    new Set([1, totalPages, page - 1, page, page + 1]),
  )
    .filter((number) => number >= 1 && number <= totalPages)
    .sort((left, right) => left - right);

  return (
    <section className={styles.tableCard} aria-labelledby="orders-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>Order history</p>
          <h2 id="orders-title">All orders</h2>
        </div>
        <p className={styles.chartNote}>
          {total} {total === 1 ? "order" : "orders"} · 10 per page
        </p>
      </div>

      {orders.length === 0 ? (
        <p className={styles.emptyState}>
          No orders yet. New customer orders will appear here.
        </p>
      ) : (
        <>
          <div
            className={styles.tableScroll}
            role="region"
            aria-label="Orders table"
            tabIndex={0}
          >
            <table className={styles.orderTable}>
              <caption>
                All orders, page {page} of {totalPages || 1}. Use the column
                headings to change the sort order.
              </caption>
              <thead>
                <tr>
                  {columns.map(({ key, label, numeric }) => {
                    const active = sort === key;
                    const ariaSort = active
                      ? direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none";

                    return (
                      <th
                        key={key}
                        aria-sort={ariaSort}
                        className={numeric ? styles.numeric : undefined}
                        scope="col"
                      >
                        <Link
                          href={getSortHref(key, sort, direction)}
                          className={styles.sortLink}
                        >
                          {label}
                          <span aria-hidden="true">
                            {active ? (direction === "asc" ? " ↑" : " ↓") : ""}
                          </span>
                        </Link>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className={styles.orderId}>{order.id}</span>
                      <span className={styles.date}>
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td>
                      <span>{order.name}</span>
                      <span className={styles.date}>{order.phone}</span>
                    </td>
                    <td>{order.neighborhood || "Unspecified"}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          order.status === "CANCELLED" ? styles.cancelled : ""
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className={styles.numeric}>{formatEtb(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label="Order pages">
              {page > 1 && (
                <Link
                  href={getPageHref(page - 1, sort, direction)}
                  rel="prev"
                >
                  Previous
                </Link>
              )}
              {visiblePages.map((number, index) => {
                const previousPage = visiblePages[index - 1];
                const gap = previousPage !== undefined && number - previousPage > 1;

                return (
                  <span className={styles.pageGroup} key={number}>
                    {gap && <span aria-hidden="true">…</span>}
                    {number === page ? (
                      <span aria-current="page" className={styles.currentPage}>
                        {number}
                      </span>
                    ) : (
                      <Link href={getPageHref(number, sort, direction)}>
                        {number}
                      </Link>
                    )}
                  </span>
                );
              })}
              {page < totalPages && (
                <Link href={getPageHref(page + 1, sort, direction)} rel="next">
                  Next
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </section>
  );
}
