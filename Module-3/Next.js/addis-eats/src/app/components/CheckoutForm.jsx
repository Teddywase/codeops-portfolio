"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../providers";
import styles from "./checkout-form.module.css";

export default function CheckoutForm() {
  const { items, subtotal, hasHydrated, clearCart } = useCart();
  const [order, setOrder] = useState(null);

  if (!hasHydrated) {
    return <p className={styles.status}>Loading your order…</p>;
  }

  if (order) {
    return (
      <section className={styles.confirmation} aria-live="polite">
        <span className={styles.confirmationIcon} aria-hidden="true">
          ✓
        </span>
        <p className={styles.eyebrow}>Order received</p>
        <h2>Thank you, {order.name}!</h2>
        <p>
          Your demo order <strong>{order.number}</strong> is ready for
          confirmation. The order total is <strong>${order.total}</strong> and
          payment is due on delivery.
        </p>
        <Link className={styles.primaryButton} href="/menu">
          Back to the menu
        </Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className={styles.empty}>
        <p>Your cart is empty. Add a dish before checking out.</p>
        <Link className={styles.primaryButton} href="/menu">
          Browse the menu
        </Link>
      </section>
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");

    if (typeof name !== "string" || name.trim() === "") {
      const nameField = event.currentTarget.elements.namedItem("name");
      nameField.setCustomValidity("Please enter your name.");
      nameField.reportValidity();
      return;
    }

    const nameField = event.currentTarget.elements.namedItem("name");
    nameField.setCustomValidity("");
    setOrder({
      name: name.trim(),
      number: `AE-${Date.now().toString(36).toUpperCase()}`,
      total: subtotal,
    });
    clearCart();
  }

  return (
    <div className={styles.layout}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Delivery details</h2>

        <label className={styles.field}>
          Full name
          <input
            autoComplete="name"
            name="name"
            onChange={(event) => event.currentTarget.setCustomValidity("")}
            placeholder="Your name"
            required
          />
        </label>

        <label className={styles.field}>
          Phone number
          <input
            autoComplete="tel"
            name="phone"
            placeholder="+251 9..."
            required
            type="tel"
          />
        </label>

        <label className={styles.field}>
          Delivery address
          <textarea
            autoComplete="street-address"
            name="address"
            placeholder="Street, neighborhood, and any directions"
            required
            rows={3}
          />
        </label>

        <label className={styles.field}>
          Order notes <span className={styles.optional}>(optional)</span>
          <textarea
            name="notes"
            placeholder="Anything we should know?"
            rows={2}
          />
        </label>

        <button className={styles.primaryButton} type="submit">
          Place demo order · ${subtotal}
        </button>
        <p className={styles.disclaimer}>
          Demo checkout only. No payment is collected and no order is sent to a
          restaurant.
        </p>
      </form>

      <aside className={styles.summary}>
        <h2>Order summary</h2>
        <ul>
          {items.map(({ dish, quantity }) => (
            <li className={styles.summaryItem} key={dish.id}>
              <span>
                {dish.name} <span className={styles.itemQuantity}>× {quantity}</span>
              </span>
              <span>${dish.price * quantity}</span>
            </li>
          ))}
        </ul>
        <div className={styles.total}>
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>
        <p className={styles.deliveryNote}>
          Delivery and any applicable taxes are calculated by the restaurant.
        </p>
        <Link className={styles.backLink} href="/cart">
          ← Return to cart
        </Link>
      </aside>
    </div>
  );
}
