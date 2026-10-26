"use client";

import { downloadCsv, toCsv } from "../../lib/csv";
import styles from "../(pages)/orders/my-orders.module.css";

export default function OrdersCsvExport({ orders }) {
  function handleExport() {
    downloadCsv(toCsv(orders), "addis-eats-order-history.csv");
  }

  return (
    <button className={styles.exportButton} onClick={handleExport} type="button">
      Download order history (CSV)
    </button>
  );
}
