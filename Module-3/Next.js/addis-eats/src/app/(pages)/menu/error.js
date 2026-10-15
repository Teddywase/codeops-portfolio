"use client";

import styles from "./error.module.css";

export default function MenuError({ error, reset }) {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Something went wrong</h1>
        <p className={styles.message}>{error?.message || "The menu could not be loaded."}</p>
        <button
          type="button"
          onClick={() => reset()}
          className={styles.retryButton}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
