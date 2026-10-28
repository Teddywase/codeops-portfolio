import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import CheckoutForm from "../../components/CheckoutForm";
import { getSession } from "../../../lib/session";
import styles from "./checkout.module.css";

export const metadata = {
  title: "Checkout",
  description: "Enter your delivery details to complete your Addis Eats order.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=%2Fcheckout");
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Almost there</p>
          <h1 className={styles.heading}>Complete your order</h1>
          <p className={styles.description}>
            Add your delivery details and review your order.
          </p>
        </header>
        <CheckoutForm initialRequestId={randomUUID()} />
      </div>
    </main>
  );
}