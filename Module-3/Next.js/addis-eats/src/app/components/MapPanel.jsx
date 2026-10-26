"use client";

import dynamic from "next/dynamic";
import styles from "./order-status.module.css";

const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div className={styles.mapLoading} role="status">
      Loading delivery map…
    </div>
  ),
});

export default function MapPanel(props) {
  return <DeliveryMap {...props} />;
}
