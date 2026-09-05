import { createContext, useContext, useMemo, useReducer } from 'react';
import { cartReducer, initialCartState } from './cartReducer';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);

  const value = useMemo(
    () => ({
      items: cart.items,
      total: cart.total,
      dispatch,
    }),
    [cart.items, cart.total],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside a CartProvider');
  }

  return context;
}
