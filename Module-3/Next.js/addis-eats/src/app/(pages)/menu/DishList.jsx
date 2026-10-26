import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "../../components/AddToCartButton";
import { formatEtb } from "../../../lib/format";
import styles from "./dish-list.module.css";

export default function DishList({ dishes }) {
  return (
    <div className={styles.grid}>
      {dishes.map((dish, index) => (
        <article
          key={dish.id}
          className={styles.card}
          data-dish-category={dish.categoryId}
        >
          <Link className={styles.details} href={`/menu/${dish.slug}`}>
            {dish.image && (
              <div className={styles.imageFrame}>
                <Image
                  className={styles.dishImage}
                  src={dish.image}
                  alt={dish.nameEn}
                  fill
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : undefined}
                  sizes="(max-width: 34.5rem) calc(100vw - 3rem), (max-width: 51rem) calc((100vw - 4.5rem) / 2), (max-width: 75rem) calc((100vw - 6rem) / 3), 360px"
                />
              </div>
            )}
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.name}>{dish.nameEn}</h2>
                {dish.nameAm && (
                  <p className={styles.amharicName}>{dish.nameAm}</p>
                )}
              </div>
              <span className={styles.price}>
                {formatEtb(dish.price)}
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
          <AddToCartButton className={styles.cartAction} dish={dish} />
        </article>
      ))}
    </div>
  );
}
