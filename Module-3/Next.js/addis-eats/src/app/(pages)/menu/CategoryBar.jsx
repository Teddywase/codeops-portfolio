"use client";

import { useSearchParams } from "next/navigation";
import SearchBox, { updateMenuUrl } from "./SearchBox";
import styles from "./category-bar.module.css";

export default function CategoryBar({
  categories,
  pageData,
  query,
  category,
  page,
}) {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q") ?? "";
  const categoryFromUrl = searchParams.get("category") ?? "all";
  const filters = [{ id: "all", label: "All dishes" }, ...categories];

  return (
    <section className={styles.shell}>
      <aside className={styles.sidebar} aria-labelledby="menu-categories-title">
        <h2 className={styles.sidebarTitle} id="menu-categories-title">
          Categories
        </h2>
        <div
          role="group"
          className={styles.filters}
          aria-label="Filter dishes"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`${styles.filter} ${
                categoryFromUrl === filter.id ? styles.selected : ""
              }`}
              aria-pressed={categoryFromUrl === filter.id}
              onClick={() =>
                updateMenuUrl(
                  { query: queryFromUrl, category: filter.id, page: 1 },
                  "pushState",
                )
              }
            >
              {filter.label}
            </button>
          ))}
        </div>
      </aside>

      <SearchBox
        pageData={pageData}
        query={query}
        category={category}
        page={page}
      />
    </section>
  );
}
