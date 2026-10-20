import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "../../../../lib/db";
import { getSession } from "../../../../lib/session";
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
        <OrderStatus initialStatus={initialStatus} />
        <Link className={styles.backLink} href="/menu">
          Back to the menu
        </Link>
      </section>
    </main>
  );
}
