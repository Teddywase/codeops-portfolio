"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "../../../lib/fetcher";
import DishList from "./DishList";
import styles from "./category-bar.module.css";
import browserStyles from "./menu-browser.module.css";

function parsePage(value) {
  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

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

export default function CategoryBar({ categories, initialPage }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const urlCategory = searchParams.get("category") ?? "all";
  const urlPage = parsePage(searchParams.get("page") ?? "1");
  const [searchInput, setSearchInput] = useState(urlQuery);
  const [query, setQuery] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [page, setPage] = useState(urlPage);

  useEffect(() => {
    function syncFromLocation() {
      const params = new URLSearchParams(window.location.search);
      const nextQuery = params.get("q") ?? "";

      setSearchInput(nextQuery);
      setQuery(nextQuery);
      setSelectedCategory(params.get("category") ?? "all");
      setPage(parsePage(params.get("page") ?? "1"));
    }

    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, []);

  useEffect(() => {
    const nextQuery = searchInput.trim();

    if (nextQuery === query) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setQuery(nextQuery);
      setPage(1);
      router.replace(menuHref(nextQuery, selectedCategory, 1), {
        scroll: false,
      });
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [query, router, searchInput, selectedCategory]);

  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (selectedCategory !== "all") {
    params.set("category", selectedCategory);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const key = params.size > 0 ? `/api/dishes?${params.toString()}` : null;
  const { data, error } = useSWR(key, fetcher, {
    dedupingInterval: 60_000,
    fallbackData: key === null ? initialPage : undefined,
    keepPreviousData: true,
    revalidateOnFocus: true,
  });
  const pageData = data ?? (key === null ? initialPage : null);
  const filters = [{ id: "all", label: "All dishes" }, ...categories];

  function selectCategory(categoryId) {
    const nextQuery = searchInput.trim();
    setQuery(nextQuery);
    setSelectedCategory(categoryId);
    setPage(1);
    router.push(menuHref(nextQuery, categoryId, 1), { scroll: false });
  }

  function selectPage(nextPage) {
    const nextQuery = searchInput.trim();
    setQuery(nextQuery);
    setPage(nextPage);
    router.push(menuHref(nextQuery, selectedCategory, nextPage), {
      scroll: false,
    });
  }

  return (
    <section className={styles.shell}>
      <aside className={styles.sidebar} aria-labelledby="menu-categories-title">
        <h2 className={styles.sidebarTitle} id="menu-categories-title">
          Categories
        </h2>
        <div className={styles.filters} role="group" aria-label="Filter dishes">
          {filters.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`${styles.filter} ${
                selectedCategory === category.id ? styles.selected : ""
              }`}
              aria-pressed={selectedCategory === category.id}
              onClick={() => selectCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </aside>

      <div className={styles.content}>
        <label className={browserStyles.searchField}>
          <span>Search dishes</span>
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Try kitfo or tibs"
            autoComplete="off"
          />
        </label>

        {error && (
          <p className={browserStyles.error} role="alert">
            {error.message || "Could not load dishes. Please try again."}
          </p>
        )}

        {pageData ? (
          <>
            <DishList dishes={pageData.items} />
            {pageData.items.length === 0 && (
              <p className={browserStyles.empty}>No dishes match your search.</p>
            )}
            {pageData.totalPages > 1 && (
              <nav className={browserStyles.pagination} aria-label="Menu pages">
                <button
                  type="button"
                  onClick={() => selectPage(page - 1)}
                  disabled={page <= 1}
                >
                  Previous
                </button>
                <span aria-current="page">
                  Page {page} of {pageData.totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => selectPage(page + 1)}
                  disabled={page >= pageData.totalPages}
                >
                  Next
                </button>
              </nav>
            )}
          </>
        ) : (
          <p className={browserStyles.status} role="status">
            Loading dishes…
          </p>
        )}
      </div>
    </section>
  );
}
