import Link from "next/link";
import DishList from "./DishList";
import styles from "./category-bar.module.css";
import browserStyles from "./menu-browser.module.css";

function menuHref(query, category, page) {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (category !== "all") {
    params.set("category", category);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const search = params.toString();
  return search ? `/menu?${search}` : "/menu";
}

export default function CategoryBar({
  categories,
  pageData,
  query,
  category,
  page,
}) {
  const filters = [{ id: "all", label: "All dishes" }, ...categories];

  return (
    <section className={styles.shell}>
      <aside className={styles.sidebar} aria-labelledby="menu-categories-title">
        <h2 className={styles.sidebarTitle} id="menu-categories-title">
          Categories
        </h2>
        <form
          action="/menu"
          method="get"
          className={styles.filters}
          aria-label="Filter dishes"
        >
          <input type="hidden" name="q" value={query} />
          <input type="hidden" name="page" value="1" />
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="submit"
              name="category"
              value={filter.id}
              className={`${styles.filter} ${
                category === filter.id ? styles.selected : ""
              }`}
              aria-pressed={category === filter.id}
            >
              {filter.label}
            </button>
          ))}
        </form>
      </aside>

      <div className={styles.content}>
        <form
          action="/menu"
          method="get"
          className={browserStyles.searchField}
          role="search"
        >
          <label htmlFor="menu-search">Search dishes</label>
          <input
            id="menu-search"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Try kitfo or tibs"
            autoComplete="off"
          />
          {category !== "all" && (
            <input type="hidden" name="category" value={category} />
          )}
          <input type="hidden" name="page" value="1" />
          <button className={browserStyles.searchButton} type="submit">
            Search
          </button>
        </form>

        <DishList dishes={pageData.items} />
        {pageData.items.length === 0 && (
          <p className={browserStyles.empty}>No dishes match your search.</p>
        )}
        {pageData.totalPages > 1 && (
          <nav className={browserStyles.pagination} aria-label="Menu pages">
            {page <= 1 ? (
              <button type="button" disabled>
                Previous
              </button>
            ) : (
              <Link
                href={menuHref(query, category, page - 1)}
                prefetch={false}
              >
                Previous
              </Link>
            )}
            <span aria-current="page">
              Page {page} of {pageData.totalPages}
            </span>
            {page >= pageData.totalPages ? (
              <button type="button" disabled>
                Next
              </button>
            ) : (
              <Link
                href={menuHref(query, category, page + 1)}
                prefetch={false}
              >
                Next
              </Link>
            )}
          </nav>
        )}
      </div>
    </section>
  );
}
