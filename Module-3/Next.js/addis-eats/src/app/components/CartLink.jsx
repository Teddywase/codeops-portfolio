"use client";

import Link from "next/link";
import { useCart } from "../providers";
import styles from "./cart-link.module.css";

export default function CartLink() {
  const { itemCount, hasHydrated } = useCart();

  return (
    <Link
      href="/cart"
      className={styles.link}
      aria-label={`Cart${
        hasHydrated
          ? `, ${itemCount} ${itemCount === 1 ? "item" : "items"}`
          : ""
      }`}
    >
      Cart
      {hasHydrated && itemCount > 0 && (
        <span className={styles.count} aria-hidden="true">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
