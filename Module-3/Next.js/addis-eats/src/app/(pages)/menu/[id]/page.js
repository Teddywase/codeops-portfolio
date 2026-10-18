import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "../../../components/AddToCartButton";
import JsonLd from "../../../components/JsonLd";
import { getDish, getDishes } from "../../../../lib/menu";
import { absoluteUrl } from "../../../../lib/site-url";
import styles from "./dish-detail.module.css";

export const dynamicParams = false;

export async function generateStaticParams() {
  const dishes = await getDishes();

  return dishes.flatMap((dish) => [{ id: dish.slug }, { id: dish.id }]);
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) {
    return {
      title: "Dish not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${dish.nameEn} - Ethiopian Food`;
  const description = dish.tagline || dish.description;
  const canonical = `/menu/${encodeURIComponent(dish.slug)}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      siteName: "Addis Eats",
      title,
      description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) {
    notFound();
  }

  const image = dish.image
    ? absoluteUrl(dish.image)
    : absoluteUrl("/assets/hero.jpg");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: dish.nameEn,
    description: dish.description,
    image,
    sku: dish.id,
    category: dish.category,
    brand: {
      "@type": "Brand",
      name: "Addis Eats",
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/menu/${encodeURIComponent(dish.slug)}`),
      price: dish.price,
      priceCurrency: dish.currency,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <main className={styles.page}>
      <JsonLd data={jsonLd} />
      <article className={styles.card}>
        <Link className={styles.backLink} href="/menu">
          ← Back to menu
        </Link>
        <p className={styles.eyebrow}>{dish.category}</p>
        {dish.nameAm && <p className={styles.amharicName}>{dish.nameAm}</p>}
        <h1 className={styles.title}>{dish.nameEn}</h1>
        {dish.image && (
          <div className={styles.imageFrame}>
            <Image
              className={styles.dishImage}
              src={dish.image}
              alt={dish.nameEn}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        )}
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
