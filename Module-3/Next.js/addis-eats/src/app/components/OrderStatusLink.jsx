"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";
import {
  ORDER_TRACKING_CHANGED_EVENT,
  ORDER_TRACKING_STORAGE_KEY,
} from "../../lib/order-tracking";
import styles from "./order-status-link.module.css";

export default function OrderStatusLink() {
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    function syncOrderId() {
      setOrderId(window.localStorage.getItem(ORDER_TRACKING_STORAGE_KEY));
    }

    syncOrderId();
    window.addEventListener(ORDER_TRACKING_CHANGED_EVENT, syncOrderId);
    window.addEventListener("storage", syncOrderId);

    return () => {
      window.removeEventListener(ORDER_TRACKING_CHANGED_EVENT, syncOrderId);
      window.removeEventListener("storage", syncOrderId);
    };
  }, []);

  const { data, error } = useSWR(
    orderId ? `/api/orders/${encodeURIComponent(orderId)}` : null,
    fetcher,
    { dedupingInterval: 5_000, refreshInterval: orderId ? 5_000 : 0 },
  );

  return (
    <Link
      className={styles.link}
      href={orderId ? `/orders/${encodeURIComponent(orderId)}` : "/checkout"}
      aria-label={
        data?.status
          ? `Order status: ${data.status}`
          : error
            ? "Order status unavailable"
            : "Order status"
      }
    >
      Order
      {data?.status && (
        <span className={styles.status} aria-hidden="true">
          {data.status}
        </span>
      )}
      {error && (
        <span className={styles.unavailable} aria-hidden="true">
          Unavailable
        </span>
      )}
    </Link>
  );
}
