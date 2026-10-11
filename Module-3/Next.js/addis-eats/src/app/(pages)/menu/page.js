import CategoryBar from "./CategoryBar";
import DishList from "./DishList";
import { getDishCategories, getDishes } from "../../../lib/menu";
import styles from "./menu.module.css";

export const revalidate = 3600;

export default async function MenuPage() {
  const [dishes, categories] = await Promise.all([
    getDishes(),
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

        <CategoryBar categories={categories}>
          <DishList dishes={dishes} />
        </CategoryBar>
      </div>
    </main>
  );
}
