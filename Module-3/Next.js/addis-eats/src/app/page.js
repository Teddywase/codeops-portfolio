import JsonLd from "./components/JsonLd";
import styles from "./home.module.css";
import { getDishes } from "../lib/menu";
import { formatEtb } from "../lib/format";
import { absoluteUrl } from "../lib/site-url";

export const metadata = {
  title: "Ethiopian Restaurant and Menu",
  description:
    "Explore Ethiopian favorites, discover Addis Eats dishes, and browse the menu.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Addis Eats | Ethiopian Restaurant",
    description:
      "Explore Ethiopian favorites, discover Addis Eats dishes, and browse the menu.",
    url: "/",
  },
};

export default async function Home() {
  const dishes = await getDishes();
  const prices = dishes.map((dish) => dish.price);
  const priceRange = prices.length
    ? `${formatEtb(Math.min(...prices))}-${formatEtb(Math.max(...prices))}`
    : "ETB";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Addis Eats",
    url: absoluteUrl("/"),
    image: absoluteUrl("/assets/hero.jpg"),
    servesCuisine: "Ethiopian",
    priceRange,
    menu: absoluteUrl("/menu"),
  };

  return (
    <main className={styles.page}>
      <JsonLd data={jsonLd} />
      <h1 className={styles.heading}>
        Addis Eats
      </h1>
    </main>
  );
}
