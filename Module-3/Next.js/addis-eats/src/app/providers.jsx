"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "addis-eats-cart";
const EMPTY_ITEMS = [];
const SERVER_SNAPSHOT = {
  items: EMPTY_ITEMS,
  itemCount: 0,
  subtotal: 0,
  hasHydrated: false,
};
const listeners = new Set();

let cartSnapshot = SERVER_SNAPSHOT;
let hasInitialized = false;

function isCartItem(item) {
  return (
    item !== null &&
    typeof item === "object" &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    item.dish !== null &&
    typeof item.dish === "object" &&
    typeof item.dish.id === "string" &&
    typeof item.dish.name === "string" &&
    typeof item.dish.price === "number" &&
    Number.isFinite(item.dish.price) &&
    item.dish.price >= 0
  );
}

function notifySubscribers() {
  for (const listener of listeners) {
    listener();
  }
}

function publishCart(items, hasHydrated = cartSnapshot.hasHydrated) {
  cartSnapshot = {
    items,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
    subtotal: items.reduce(
      (total, item) => total + item.dish.price * item.quantity,
      0,
    ),
    hasHydrated,
  };
  notifySubscribers();
}

function readStoredCart() {
  const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

  if (!storedCart) {
    return EMPTY_ITEMS;
  }

  try {
    const parsedCart = JSON.parse(storedCart);

    if (Array.isArray(parsedCart) && parsedCart.every(isCartItem)) {
      return parsedCart;
    }

    console.error("Saved cart data is invalid and has been discarded.");
  } catch (error) {
    console.error("Saved cart data could not be read.", error);
  }

  window.localStorage.removeItem(CART_STORAGE_KEY);
  return EMPTY_ITEMS;
}

function initializeCart() {
  if (!hasInitialized) {
    const storedItems = readStoredCart();
    hasInitialized = true;
    publishCart(storedItems, true);
  }
}

function subscribeToCart(listener) {
  listeners.add(listener);
  initializeCart();

  return () => {
    listeners.delete(listener);
  };
}

function getCartSnapshot() {
  return cartSnapshot;
}

function getServerCartSnapshot() {
  return SERVER_SNAPSHOT;
}

function updateCart(updateItems) {
  if (!cartSnapshot.hasHydrated) {
    throw new Error("The cart is not ready yet.");
  }

  const items = updateItems(cartSnapshot.items);
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  publishCart(items);
}

export function Providers({ children }) {
  const { items, itemCount, subtotal, hasHydrated } = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );

  const addItem = useCallback((dish) => {
    updateCart((currentItems) => {
      const existingItem = currentItems.find((item) => item.dish.id === dish.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { dish, quantity: 1 }];
    });
  }, []);

  const setQuantity = useCallback((dishId, quantity) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return;
    }

    updateCart((currentItems) =>
      currentItems.map((item) =>
        item.dish.id === dishId ? { ...item, quantity } : item,
      ),
    );
  }, []);

  const removeItem = useCallback((dishId) => {
    updateCart((currentItems) =>
      currentItems.filter((item) => item.dish.id !== dishId),
    );
  }, []);

  const clearCart = useCallback(() => {
    updateCart(() => EMPTY_ITEMS);
  }, []);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      hasHydrated,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      itemCount,
      subtotal,
      hasHydrated,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);

  if (cart === null) {
    throw new Error("useCart must be used within the app Providers component.");
  }

  return cart;
}
