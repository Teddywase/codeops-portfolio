"use client";

import { useState } from "react";
import styles from "./category-bar.module.css";

export default function CategoryBar({ children, categories }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const filters = [{ id: "all", label: "All dishes" }, ...categories];

  return (
    <section className={styles.shell}>
      <div
        className={styles.filters}
        role="group"
        aria-label="Filter dishes by category"
      >
        {filters.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`${styles.filter} ${
              selectedCategory === category.id ? styles.selected : ""
            }`}
            aria-pressed={selectedCategory === category.id}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className={styles.content} data-selected-category={selectedCategory}>
        {children}
      </div>
    </section>
  );
}
