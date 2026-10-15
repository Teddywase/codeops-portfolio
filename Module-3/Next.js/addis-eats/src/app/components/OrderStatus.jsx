"use client";

import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";
import styles from "./order-status.module.css";

export default function OrderStatus({ initialStatus }) {
  const { data, error } = useSWR(
    `/api/orders/${encodeURIComponent(initialStatus.id)}`,
    fetcher,
    {
      dedupingInterval: 5_000,
      fallbackData: initialStatus,
      keepPreviousData: true,
      refreshInterval: 5_000,
      revalidateOnFocus: true,
    },
  );
  const order = data ?? initialStatus;

  return (
    <div className={styles.status} aria-live="polite">
      <p className={styles.label}>Current status</p>
      <p className={styles.value}>{order.status}</p>
      {error && (
        <p className={styles.error} role="alert">
          Status could not be refreshed. Showing the last available update.
        </p>
      )}
      <p className={styles.updated}>
        Updates automatically every five seconds.
      </p>
    </div>
  );
}
