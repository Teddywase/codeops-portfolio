"use client";

import styles from "./kitchen.module.css";

export default function KitchenError({ reset }) {
  return (
    <main className={styles.page}>
      <section className={styles.errorCard} role="alert">
        <p className={styles.eyebrow}>Dashboard unavailable</p>
        <h1 className={styles.heading}>We couldn&apos;t load the kitchen data.</h1>
        <p className={styles.description}>
          Please try again. If the problem continues, contact the site
          administrator.
        </p>
        <button className={styles.retryButton} onClick={reset} type="button">
          Try again
        </button>
      </section>
    </main>
  );
}
