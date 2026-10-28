"use client";

import Link from "next/link";
import {
  useActionState,
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { cancelOrder, placeOrder } from "../actions";
import { useCart } from "../providers";
import {
  ORDER_REQUEST_CHANGED_EVENT,
  ORDER_REQUEST_STORAGE_KEY,
  ORDER_TRACKING_CHANGED_EVENT,
  ORDER_TRACKING_STORAGE_KEY,
} from "../../lib/order-tracking";
import { formatEtb } from "../../lib/format";
import { orderSchema, ORDER_NEIGHBORHOODS } from "../../lib/schema";
import styles from "./checkout-form.module.css";

export default function CheckoutForm({ initialRequestId }) {
  const { items, subtotal, hasHydrated, clearCart } = useCart();
  const [state, formAction, isPending] = useActionState(placeOrder, null);
  const [cancelState, cancelFormAction, isCancelPending] = useActionState(
    cancelOrder,
    null,
  );
  const [clientErrors, setClientErrors] = useState(null);
  const subscribeToRequestId = useCallback((onStoreChange) => {
    function handleStorageChange(event) {
      if (event.key === ORDER_REQUEST_STORAGE_KEY || event.key === null) {
        onStoreChange();
      }
    }

    window.addEventListener(ORDER_REQUEST_CHANGED_EVENT, onStoreChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(ORDER_REQUEST_CHANGED_EVENT, onStoreChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  const getRequestId = useCallback(() => {
    const storedRequestId = window.localStorage.getItem(ORDER_REQUEST_STORAGE_KEY);
    return orderSchema.shape.requestId.safeParse(storedRequestId).success
      ? storedRequestId
      : initialRequestId;
  }, [initialRequestId]);
  const getServerRequestId = useCallback(
    () => initialRequestId,
    [initialRequestId],
  );
  const requestId = useSyncExternalStore(
    subscribeToRequestId,
    getRequestId,
    getServerRequestId,
  );

  useEffect(() => {
    const storedRequestId = window.localStorage.getItem(
      ORDER_REQUEST_STORAGE_KEY,
    );

    if (!orderSchema.shape.requestId.safeParse(storedRequestId).success) {
      window.localStorage.setItem(ORDER_REQUEST_STORAGE_KEY, initialRequestId);
      window.dispatchEvent(new Event(ORDER_REQUEST_CHANGED_EVENT));
    }
  }, [getRequestId, initialRequestId]);

  useEffect(() => {
    if (!state?.refreshRequestId) {
      return;
    }

    const refreshedRequestId = window.crypto.randomUUID();
    window.localStorage.setItem(
      ORDER_REQUEST_STORAGE_KEY,
      refreshedRequestId,
    );
    window.dispatchEvent(new Event(ORDER_REQUEST_CHANGED_EVENT));
  }, [state]);

  useEffect(() => {
    if (state?.order) {
      clearCart();
      window.localStorage.setItem(ORDER_TRACKING_STORAGE_KEY, state.order.id);
      window.localStorage.removeItem(ORDER_REQUEST_STORAGE_KEY);
      window.dispatchEvent(new Event(ORDER_REQUEST_CHANGED_EVENT));
      window.dispatchEvent(new Event(ORDER_TRACKING_CHANGED_EVENT));
    }
  }, [state, clearCart]);

  useEffect(() => {
    if (cancelState?.success && state?.order) {
      const trackedOrderId = window.localStorage.getItem(
        ORDER_TRACKING_STORAGE_KEY,
      );

      if (trackedOrderId === state.order.id) {
        window.localStorage.removeItem(ORDER_TRACKING_STORAGE_KEY);
        window.dispatchEvent(new Event(ORDER_TRACKING_CHANGED_EVENT));
      }
    }
  }, [cancelState, state]);

  if (!hasHydrated) {
    return <p className={styles.status}>Loading your order…</p>;
  }

  if (cancelState?.success) {
    return (
      <section className={styles.confirmation} aria-live="polite">
        <p className={styles.eyebrow}>Order cancelled</p>
        <h2>Your order was cancelled</h2>
        <p>{cancelState.message}</p>
        <Link className={styles.primaryButton} href="/menu">
          Back to the menu
        </Link>
      </section>
    );
  }

  if (state?.order) {
    return (
      <section className={styles.confirmation} aria-live="polite">
        <span className={styles.confirmationIcon} aria-hidden="true">
          ✓
        </span>
        <p className={styles.eyebrow}>Order received</p>
        <h2>Thank you for your order!</h2>
        <p>
          Your order <strong>{state.order.id}</strong> has been received. The
          total is{" "}
          <strong>
            {formatEtb(state.order.total)}
          </strong>
          . Payment is due on delivery.
        </p>
        <Link
          className={styles.primaryButton}
          href={`/orders/${encodeURIComponent(state.order.id)}`}
        >
          Track your order
        </Link>
        {cancelState?.error && (
          <p className={styles.formError} role="alert">
            {cancelState.error}
          </p>
        )}
        <form action={cancelFormAction}>
          <input name="orderId" type="hidden" value={state.order.id} />
          <button
            className={styles.cancelButton}
            disabled={isCancelPending}
            type="submit"
          >
            {isCancelPending ? "Cancelling…" : "Cancel this order"}
          </button>
        </form>
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

  const orderItems = JSON.stringify(
    items.map(({ dish, quantity }) => ({ dishId: dish.id, quantity })),
  );
  const fieldErrors = clientErrors ?? state?.fieldErrors ?? {};

  function validateOrder(event) {
    const formData = new FormData(event.currentTarget);
    let submittedItems;

    try {
      submittedItems = JSON.parse(formData.get("items"));
    } catch {
      event.preventDefault();
      setClientErrors({ items: ["Your cart data is invalid."] });
      return;
    }

    const result = orderSchema.safeParse({
      name: formData.get("name"),
      phone: formData.get("phone"),
      neighborhood: formData.get("neighborhood"),
      address: formData.get("address"),
      notes: formData.get("notes"),
      requestId: formData.get("requestId"),
      items: submittedItems,
    });

    if (!result.success) {
      event.preventDefault();
      setClientErrors(result.error.flatten().fieldErrors);
      return;
    }

    setClientErrors(null);
  }

  return (
    <div className={styles.layout}>
      <form
        action={formAction}
        aria-busy={isPending}
        className={styles.form}
        noValidate
        onSubmit={validateOrder}
      >
        <h2>Delivery details</h2>
        <input name="items" type="hidden" value={orderItems} />
        <input name="requestId" type="hidden" value={requestId} />

        {(clientErrors || state?.error) && (
          <p className={styles.formError} role="alert">
            {clientErrors
              ? "Check the highlighted fields and try again."
              : state.error}
          </p>
        )}

        <label className={styles.field}>
          Full name
          <input
            autoComplete="name"
            name="name"
            placeholder="Your name"
            required
            minLength={2}
            maxLength={80}
            aria-invalid={Boolean(fieldErrors.name?.length)}
            aria-describedby={fieldErrors.name?.length ? "name-error" : undefined}
          />
          {fieldErrors.name?.length > 0 && (
            <span className={styles.fieldError} id="name-error" role="alert">
              {fieldErrors.name[0]}
            </span>
          )}
        </label>

        <label className={styles.field}>
          Phone number
          <input
            autoComplete="tel"
            inputMode="tel"
            name="phone"
            placeholder="+251 9..."
            pattern="(09[0-9]{8}|\\+2519[0-9]{8})"
            required
            type="tel"
            aria-invalid={Boolean(fieldErrors.phone?.length)}
            aria-describedby={fieldErrors.phone?.length ? "phone-error" : undefined}
          />
          {fieldErrors.phone?.length > 0 && (
            <span className={styles.fieldError} id="phone-error" role="alert">
              {fieldErrors.phone[0]}
            </span>
          )}
        </label>

        <label className={styles.field}>
          Neighborhood
          <select
            defaultValue=""
            name="neighborhood"
            required
            aria-invalid={Boolean(fieldErrors.neighborhood?.length)}
            aria-describedby={
              fieldErrors.neighborhood?.length ? "neighborhood-error" : undefined
            }
          >
            <option disabled value="">Choose your neighborhood</option>
            {ORDER_NEIGHBORHOODS.map((neighborhood) => (
              <option key={neighborhood} value={neighborhood}>
                {neighborhood}
              </option>
            ))}
          </select>
          {fieldErrors.neighborhood?.length > 0 && (
            <span className={styles.fieldError} id="neighborhood-error" role="alert">
              {fieldErrors.neighborhood[0]}
            </span>
          )}
        </label>

        <label className={styles.field}>
          Delivery address
          <textarea
            autoComplete="street-address"
            name="address"
            placeholder="Street, neighborhood, and any directions"
            required
            rows={3}
            minLength={5}
            maxLength={300}
            aria-invalid={Boolean(fieldErrors.address?.length)}
            aria-describedby={fieldErrors.address?.length ? "address-error" : undefined}
          />
          {fieldErrors.address?.length > 0 && (
            <span className={styles.fieldError} id="address-error" role="alert">
              {fieldErrors.address[0]}
            </span>
          )}
        </label>

        <label className={styles.field}>
          Order notes <span className={styles.optional}>(optional)</span>
          <textarea
            name="notes"
            placeholder="Anything we should know?"
            rows={2}
            maxLength={200}
            aria-invalid={Boolean(fieldErrors.notes?.length)}
            aria-describedby={fieldErrors.notes?.length ? "notes-error" : undefined}
          />
          {fieldErrors.notes?.length > 0 && (
            <span className={styles.fieldError} id="notes-error" role="alert">
              {fieldErrors.notes[0]}
            </span>
          )}
        </label>

        <button
          className={styles.primaryButton}
          disabled={isPending || !requestId}
          type="submit"
        >
          {isPending
            ? "Placing your order…"
            : `Place order · ${formatEtb(subtotal)}`}
        </button>
      </form>

      <aside className={styles.summary}>
        <h2>Order summary</h2>
        <ul>
          {items.map(({ dish, quantity }) => (
            <li className={styles.summaryItem} key={dish.id}>
              <span>
                {dish.name}{" "}
                <span className={styles.itemQuantity}>× {quantity}</span>
              </span>
              <span>{formatEtb(dish.price * quantity)}</span>
            </li>
          ))}
        </ul>
        <div className={styles.total}>
          <span>Subtotal</span>
          <span>{formatEtb(subtotal)}</span>
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
