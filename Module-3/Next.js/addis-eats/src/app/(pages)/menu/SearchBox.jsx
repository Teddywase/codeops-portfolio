"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "../../../lib/fetcher";
import DishList from "./DishList";
import browserStyles from "./menu-browser.module.css";

function dishesKey(query, category, page) {
  const params = new URLSearchParams();

  if (query.trim()) {
    params.set("q", query.trim());
  }

  if (category !== "all") {
    params.set("category", category);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const search = params.toString();
  return search ? `/api/dishes?${search}` : null;
}

function parsePage(value) {
  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function updateMenuUrl(
  { query, category, page },
  historyMethod = "replaceState",
) {
  const params = new URLSearchParams(window.location.search);

  if (query.trim()) {
    params.set("q", query.trim());
  } else {
    params.delete("q");
  }

  if (category !== "all") {
    params.set("category", category);
  } else {
    params.delete("category");
  }

  if (page > 1) {
    params.set("page", String(page));
  } else {
    params.delete("page");
  }

  const search = params.toString();
  if (search === window.location.search.slice(1)) {
    return;
  }

  const href = `${window.location.pathname}${search ? `?${search}` : ""}`;
  window.history[historyMethod](null, "", href);
}

export default function SearchBox({ pageData, query, category, page }) {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q") ?? "";
  const categoryFromUrl = searchParams.get("category") ?? "all";
  const pageFromUrl = parsePage(searchParams.get("page") ?? "1");
  const [debouncedQuery, setDebouncedQuery] = useState(queryFromUrl.trim());
  const initialKey = dishesKey(query, category, page);
  const menuKey = dishesKey(debouncedQuery, categoryFromUrl, pageFromUrl);
  const key =
    menuKey === null && initialKey !== null ? "/api/dishes?page=1" : menuKey;
  const { data, error, isValidating, mutate } = useSWR(key, fetcher, {
    dedupingInterval: 60_000,
    fallbackData: key === initialKey ? pageData : undefined,
    keepPreviousData: true,
    revalidateOnFocus: true,
  });
  const visiblePage = data ?? pageData;

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedQuery(queryFromUrl.trim()),
      300,
    );
    return () => window.clearTimeout(timeout);
  }, [queryFromUrl]);

  function handleSearchChange(event) {
    updateMenuUrl(
      {
        query: event.target.value,
        category: categoryFromUrl,
        page: 1,
      },
      "replaceState",
    );
  }

  function submitSearch(event) {
    event.preventDefault();
    setDebouncedQuery(queryFromUrl.trim());
  }

  return (
    <div>
      <form
        className={browserStyles.searchField}
        role="search"
        onSubmit={submitSearch}
      >
        <label htmlFor="menu-search">Search dishes</label>
        <input
          id="menu-search"
          type="search"
          value={queryFromUrl}
          placeholder="Try kitfo or tibs"
          autoComplete="off"
          onChange={handleSearchChange}
        />
        <button className={browserStyles.searchButton} type="submit">
          Search
        </button>
      </form>

      {isValidating && (
        <p className={browserStyles.status} role="status">
          Updating menu...
        </p>
      )}
      {error && (
        <p className={browserStyles.error} role="alert">
          {error.message || "The menu could not be updated."}{" "}
          <button type="button" onClick={() => mutate()}>
            Try again
          </button>
        </p>
      )}
      <DishList dishes={visiblePage.items} />
      {visiblePage.items.length === 0 && (
        <p className={browserStyles.empty}>No dishes match your search.</p>
      )}
      {visiblePage.totalPages > 1 && (
        <nav className={browserStyles.pagination} aria-label="Menu pages">
          {pageFromUrl <= 1 ? (
            <button type="button" disabled>
              Previous
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                updateMenuUrl(
                  {
                    query: debouncedQuery,
                    category: categoryFromUrl,
                    page: pageFromUrl - 1,
                  },
                  "pushState",
                )
              }
            >
              Previous
            </button>
          )}
          <span aria-current="page">
            Page {pageFromUrl} of {visiblePage.totalPages}
          </span>
          {pageFromUrl >= visiblePage.totalPages ? (
            <button type="button" disabled>
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                updateMenuUrl(
                  {
                    query: debouncedQuery,
                    category: categoryFromUrl,
                    page: pageFromUrl + 1,
                  },
                  "pushState",
                )
              }
            >
              Next
            </button>
          )}
        </nav>
      )}
    </div>
  );
}
