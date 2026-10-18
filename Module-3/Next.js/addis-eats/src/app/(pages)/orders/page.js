import Link from "next/link";
import { redirect } from "next/navigation";
import { getOrdersFor } from "../../../../db";
import { getSession } from "../../../lib/session";
import styles from "./my-orders.module.css";

export const metadata = {
  title: "My Orders",
  description: "View and track your Addis Eats orders.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getSession();

  if (!session?.id) {
    redirect("/signin?next=%2Forders");
  }

  const orders = await getOrdersFor(session.id);

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Your account</p>
        <h1 className={styles.heading}>My orders</h1>
        {orders.length === 0 ? (
          <>
            <p className={styles.description}>
              You haven&apos;t placed an order yet.
            </p>
            <Link className={styles.link} href="/menu">
              Browse the menu
            </Link>
          </>
        ) : (
          <ul className={styles.list}>
            {orders.map((order) => (
              <li className={styles.order} key={order.id}>
                <Link
                  className={styles.orderLink}
                  href={`/orders/${encodeURIComponent(order.id)}`}
                >
                  <span>
                    <strong>Order {order.id}</strong>
                    <span className={styles.date}>
                      {new Date(order.createdAt).toLocaleDateString("en-CA", {
                        dateStyle: "medium",
                      })}
                    </span>
                  </span>
                  <span className={styles.summary}>
                    <span>{order.status}</span>
                    <span>
                      {order.total} {order.currency}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
