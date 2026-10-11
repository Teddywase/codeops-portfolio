"use client";

import { useState } from "react";
import styles from "./category-bar.module.css";

const categories = [
  { id: "all", label: "All dishes" },
  { id: "stews", label: "Traditional stews & wat" },
  { id: "grills", label: "Tibs & grills" },
  { id: "raw", label: "Raw & cured delicacies / Kitfo" },
  { id: "vegan", label: "Fasting & vegan / Tsom" },
  { id: "drinks", label: "Hot drinks" },
];

export default function CategoryBar({ children }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <section className={styles.shell}>
      <div
        className={styles.filters}
        role="group"
        aria-label="Filter dishes by category"
      >
        {categories.map((category) => (
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
        <p className={styles.emptyState}>
          No dishes are available in this category yet.
        </p>
        {children}
      </div>
    </section>
  );
}
