import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "../../../../lib/db";
import { formatDate } from "../../../../lib/format";
import { getSession } from "../../../../lib/session";
import MapPanel from "../../../components/MapPanel";
import OrderStatus from "../../../components/OrderStatus";
import styles from "../../../components/order-status.module.css";

export const metadata = {
  title: "Order Status",
  description: "Track the status of your Addis Eats order.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }) {
  const { id } = await params;
  const session = await getSession();

  if (!session?.id) {
    notFound();
  }

  const order = await getOrder(id);

  if (!order || order.userId !== session.id) {
    notFound();
  }

  const initialStatus = {
    id: order.id,
    status: order.status,
    updatedAt: order.updatedAt ?? order.createdAt,
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Order tracking</p>
        <h1 className={styles.heading}>Your order status</h1>
        <p className={styles.orderId}>
          Order <strong>{order.id}</strong>
        </p>
        <section className={styles.mapSection} aria-labelledby="delivery-map-title">
          <h2 className={styles.mapHeading} id="delivery-map-title">
            Delivery route
          </h2>
          <p className={styles.mapDescription}>
            <strong>Delivery address:</strong> {order.address},{" "}
            {order.neighborhood}. The courier pin shows a demonstration
            position; exact GPS tracking is not available in this demo.
          </p>
          <MapPanel address={order.address} neighborhood={order.neighborhood} />
        </section>
        <OrderStatus initialStatus={initialStatus} />
        <p className={styles.updated}>
          Order placed {formatDate(order.createdAt)}.
        </p>
        <Link className={styles.backLink} href="/menu">
          Back to the menu
        </Link>
      </section>
    </main>
  );
}
