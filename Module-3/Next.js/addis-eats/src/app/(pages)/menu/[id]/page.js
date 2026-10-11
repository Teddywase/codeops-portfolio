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
        <p className={styles.eyebrow}>{dish.category}</p>
        {dish.nameAm && <p className={styles.amharicName}>{dish.nameAm}</p>}
        <h1 className={styles.title}>{dish.nameEn}</h1>
        {dish.tagline && <p className={styles.tagline}>{dish.tagline}</p>}
        <p className={styles.description}>{dish.description}</p>

        <dl className={styles.details}>
          {dish.spiceLevel && (
            <div>
              <dt>Spice level</dt>
              <dd>{dish.spiceLevel}</dd>
            </div>
          )}
          {dish.servings && (
            <div>
              <dt>Serving</dt>
              <dd>{dish.servings}</dd>
            </div>
          )}
        </dl>

        {dish.ingredients?.length > 0 && (
          <section className={styles.ingredients}>
            <h2>Ingredients</h2>
            <ul>
              {dish.ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          </section>
        )}

        <div className={styles.purchase}>
          <div>
            <p className={styles.priceLabel}>Price</p>
            <p className={styles.price}>
              {dish.currency} {dish.price}
            </p>
          </div>
          <div className={styles.actions}>
            <AddToCartButton dish={dish} />
          </div>
        </div>
      </article>
    </main>
  );
}
