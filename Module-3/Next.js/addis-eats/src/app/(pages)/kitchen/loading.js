import styles from "./kitchen.module.css";

export default function KitchenLoading() {
  return (
    <main
      className={styles.page}
      aria-busy="true"
      aria-label="Loading kitchen dashboard"
    >
      <div className={styles.container}>
        <div className={styles.loadingHeader}>
          <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
          <div className={`${styles.skeleton} ${styles.skeletonMetric}`} />
        </div>
        <div className={styles.charts}>
          {Array.from({ length: 2 }, (_, index) => (
            <section className={styles.chartCard} key={index}>
              <div className={`${styles.skeleton} ${styles.skeletonHeading}`} />
              <div className={`${styles.skeleton} ${styles.skeletonChart}`} />
              {Array.from({ length: 3 }, (__, row) => (
                <div
                  className={`${styles.skeleton} ${styles.skeletonRow}`}
                  key={row}
                />
              ))}
            </section>
          ))}
        </div>
        <section className={styles.tableCard}>
          <div className={`${styles.skeleton} ${styles.skeletonHeading}`} />
          {Array.from({ length: 5 }, (_, index) => (
            <div
              className={`${styles.skeleton} ${styles.skeletonTableRow}`}
              key={index}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
