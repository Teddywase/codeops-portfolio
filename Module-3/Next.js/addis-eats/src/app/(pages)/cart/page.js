import CartContents from "../../components/CartContents";
import styles from "./cart.module.css";

export default function CartPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Cart</p>
        <h1 className={styles.heading}>Your order</h1>
        <CartContents />
      </section>
    </main>
  );
}
