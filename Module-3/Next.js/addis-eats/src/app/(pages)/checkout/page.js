import CheckoutForm from "../../components/CheckoutForm";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
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
        <CheckoutForm />
      </div>
    </main>
  );
}