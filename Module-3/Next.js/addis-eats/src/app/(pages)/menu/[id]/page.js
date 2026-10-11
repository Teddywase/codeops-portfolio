import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "../../../components/AddToCartButton";
import { getDish } from "../../../../lib/menu";
import styles from "./dish-detail.module.css";

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <article className={styles.card}>
        <Link className={styles.backLink} href="/menu">
          ← Back to menu
        </Link>
        <p className={styles.eyebrow}>Addis Eats · Freshly prepared</p>
        <h1 className={styles.title}>{dish.name}</h1>
        <p className={styles.description}>{dish.description}</p>

        <div className={styles.purchase}>
          <div>
            <p className={styles.priceLabel}>Price</p>
            <p className={styles.price}>${dish.price}</p>
          </div>
          <div className={styles.actions}>
            <AddToCartButton dish={dish} />
          </div>
        </div>
      </article>
    </main>
  );
}
