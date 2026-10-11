import Link from "next/link";
import AddToCartButton from "../../components/AddToCartButton";
import styles from "./dish-list.module.css";

export default function DishList({ dishes }) {
  return (
    <div className={styles.grid}>
      {dishes.map((dish) => (
        <article
          key={dish.id}
          className={styles.card}
          data-dish-category={dish.categoryId}
        >
          <Link className={styles.details} href={`/menu/${dish.slug}`}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.name}>{dish.nameEn}</h2>
                {dish.nameAm && (
                  <p className={styles.amharicName}>{dish.nameAm}</p>
                )}
              </div>
              <span className={styles.price}>
                {dish.currency} {dish.price}
              </span>
            </div>
            <p className={styles.description}>{dish.description}</p>
            <div className={styles.tags}>
              {dish.isSpecial && (
                <span className={styles.specialTag}>Chef’s special</span>
              )}
              {dish.isFasting && (
                <span className={styles.fastingTag}>Fasting friendly</span>
              )}
            </div>
          </Link>
          <AddToCartButton dish={dish} />
        </article>
      ))}
    </div>
  );
}
