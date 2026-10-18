import CartContents from "../../components/CartContents";
import styles from "./cart.module.css";

export const metadata = {
  title: "Your Cart",
  description: "Review the dishes in your Addis Eats order.",
  robots: {
    index: false,
    follow: false,
  },
};

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
