"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { formatRelative } from "../../lib/format";
import { fetcher } from "../../lib/fetcher";
import styles from "./order-status.module.css";

function isTerminalStatus(status) {
  return status === "CANCELLED" || status === "DELIVERED";
}

export default function OrderStatus({ initialStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [connection, setConnection] = useState(
    isTerminalStatus(initialStatus.status) ? "closed" : "connecting",
  );
  const eventSourceRef = useRef(null);
  const { data, error } = useSWR(
    `/api/orders/${encodeURIComponent(initialStatus.id)}`,
    fetcher,
    {
      dedupingInterval: 5_000,
      fallbackData: initialStatus,
      keepPreviousData: true,
      refreshInterval: (latestStatus) =>
        connection === "reconnecting" &&
        !isTerminalStatus(status.status) &&
        !isTerminalStatus(latestStatus?.status)
          ? 5_000
          : 0,
      revalidateOnFocus: true,
    },
  );

  useEffect(() => {
    if (isTerminalStatus(initialStatus.status)) {
      return undefined;
    }

    const eventSource = new EventSource(
      `/orders/${encodeURIComponent(initialStatus.id)}/stream`,
    );
    eventSourceRef.current = eventSource;
    eventSource.onopen = () => setConnection("live");
    eventSource.onmessage = (event) => {
      const nextStatus = JSON.parse(event.data);
      setStatus(nextStatus);

      if (isTerminalStatus(nextStatus.status)) {
        eventSource.close();
        setConnection("closed");
      }
    };
    eventSource.onerror = () =>
      setConnection((current) =>
        current === "closed" ? "closed" : "reconnecting",
      );

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [initialStatus.id, initialStatus.status]);

  useEffect(() => {
    if (isTerminalStatus(data?.status)) {
      eventSourceRef.current?.close();
    }
  }, [data?.status]);

  const polledTime = Date.parse(data?.updatedAt ?? "");
  const currentTime = Date.parse(status.updatedAt);
  const hasNewerPoll =
    !Number.isNaN(polledTime) &&
    (Number.isNaN(currentTime) || polledTime > currentTime);
  const currentStatus =
    connection === "reconnecting" && hasNewerPoll ? data : status;
  const visibleConnection = isTerminalStatus(currentStatus.status)
    ? "closed"
    : connection;

  return (
    <div className={styles.status} aria-live="polite">
      <p className={styles.label}>Current status</p>
      <p className={styles.value}>{currentStatus.status}</p>
      <p className={styles.connection}>
        {visibleConnection === "live"
          ? "Live updates"
          : visibleConnection === "reconnecting"
            ? "Reconnecting · checking every five seconds"
            : visibleConnection === "closed"
              ? "Updates complete"
              : "Connecting to live updates…"}
      </p>
      {error && (
        <p className={styles.error} role="alert">
          Status could not be refreshed. Showing the last available update.
        </p>
      )}
      <p className={styles.updated}>
        Last updated {formatRelative(currentStatus.updatedAt)}.
      </p>
    </div>
  );
}
