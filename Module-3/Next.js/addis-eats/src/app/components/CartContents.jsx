"use client";

import Link from "next/link";
import { useCart } from "../providers";
import styles from "./cart-contents.module.css";

export default function CartContents() {
  const { items, itemCount, subtotal, hasHydrated, setQuantity, removeItem, clearCart } =
    useCart();

  if (!hasHydrated) {
    return <p className={styles.status}>Loading your cart…</p>;
  }

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon} aria-hidden="true">
          🛒
        </span>
        <h2>Your cart is empty</h2>
        <p>Discover something delicious on our menu.</p>
        <Link className={styles.button} href="/menu">
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className={styles.itemCount}>
        {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
      </p>
      <div className={styles.items}>
        {items.map(({ dish, quantity }) => (
          <div key={dish.id} className={styles.item}>
            <div className={styles.itemDetails}>
              <p className={styles.name}>{dish.name}</p>
              <p className={styles.unitPrice}>
                {dish.currency || "ETB"} {dish.price} each
              </p>
            </div>
            <div className={styles.controls}>
              <div className={styles.quantityControl} aria-label={`Quantity for ${dish.name}`}>
                <button
                  className={styles.quantityButton}
                  type="button"
                  aria-label={`Decrease ${dish.name} quantity`}
                  disabled={quantity === 1}
                  onClick={() => setQuantity(dish.id, quantity - 1)}
                >
                  −
                </button>
                <span aria-live="polite">{quantity}</span>
                <button
                  className={styles.quantityButton}
                  type="button"
                  aria-label={`Increase ${dish.name} quantity`}
                  disabled={quantity >= 99}
                  onClick={() => setQuantity(dish.id, quantity + 1)}
                >
                  +
                </button>
              </div>
              <p className={styles.price}>
                {dish.currency || "ETB"} {dish.price * quantity}
              </p>
              <button
                className={styles.removeButton}
                type="button"
                onClick={() => removeItem(dish.id)}
              >
                Remove item
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.total}>
        <div>
          <span>Subtotal</span>
          <span className={styles.price}>ETB {subtotal}</span>
        </div>
        <p>Taxes and delivery are calculated at checkout.</p>
      </div>

      <div className={styles.actions}>
        <Link className={styles.button} href="/menu">
          Keep shopping
        </Link>
        <button className={styles.clearButton} type="button" onClick={clearCart}>
          Clear cart
        </button>
        <Link className={`${styles.button} ${styles.checkout}`} href="/checkout">
          Continue to checkout
        </Link>
      </div>
    </>
  );
}
