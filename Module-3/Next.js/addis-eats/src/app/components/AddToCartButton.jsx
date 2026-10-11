"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../providers";
import styles from "./add-to-cart-button.module.css";

export default function AddToCartButton({ dish }) {
  const { addItem, hasHydrated } = useCart();
  const [wasAdded, setWasAdded] = useState(false);

  function handleAddToCart() {
    addItem(dish);
    setWasAdded(true);
  }

  return (
    <div className={styles.actions}>
      <button
        className={styles.button}
        type="button"
        disabled={!hasHydrated}
        onClick={handleAddToCart}
        aria-live="polite"
      >
        {!hasHydrated ? "Loading cart…" : wasAdded ? "Added to cart" : "Add to cart"}
      </button>
      {wasAdded && (
        <Link className={styles.cartLink} href="/cart">
          View cart
        </Link>
      )}
    </div>
  );
}
