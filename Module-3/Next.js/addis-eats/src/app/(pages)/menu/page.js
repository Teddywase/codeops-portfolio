import CategoryBar from "./CategoryBar";
import { getDishCategories, getDishPage } from "../../../lib/menu";
import styles from "./menu.module.css";

export const revalidate = 3600;

export const metadata = {
  title: "Ethiopian Food Menu",
  description:
    "Browse Ethiopian stews, vegan platters, and drinks on the Addis Eats menu.",
  alternates: {
    canonical: "/menu",
  },
  openGraph: {
    type: "website",
    siteName: "Addis Eats",
    title: "Ethiopian Food Menu | Addis Eats",
    description:
      "Browse Ethiopian stews, vegan platters, and drinks on the Addis Eats menu.",
    url: "/menu",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ethiopian Food Menu | Addis Eats",
    description:
      "Browse Ethiopian stews, vegan platters, and drinks on the Addis Eats menu.",
  },
};

function parsePage(value) {
  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export default async function MenuPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const category =
    typeof params.category === "string" ? params.category : "all";
  const page = parsePage(typeof params.page === "string" ? params.page : "1");
  const [pageData, categories] = await Promise.all([
    getDishPage({ query, category, page }),
    getDishCategories(),
  ]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Addis Eats</p>
          <h1 className={styles.title}>Our menu</h1>
          <p className={styles.description}>Choose a dish to see its details.</p>
        </header>

        <CategoryBar
          categories={categories}
          pageData={pageData}
          query={query}
          category={category}
          page={page}
        />
      </div>
    </main>
  );
}
