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
          data-dish-category={dish.category}
        >
          <Link className={styles.details} href={`/menu/${dish.id}`}>
            <div className={styles.cardHeader}>
              <h2 className={styles.name}>{dish.name}</h2>
              <span className={styles.price}>${dish.price}</span>
            </div>
            <p className={styles.description}>{dish.description}</p>
          </Link>
          <AddToCartButton dish={dish} />
        </article>
      ))}
    </div>
  );
}
