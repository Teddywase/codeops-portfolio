export const initialCartState = {
  items: [],
  total: 0,
};

export function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existingItem = state.items.find((item) => item.id === action.dish.id);

      const nextItems = existingItem
        ? state.items.map((item) =>
            item.id === action.dish.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...state.items, { ...action.dish, quantity: 1 }];

      const nextTotal = nextItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return { items: nextItems, total: nextTotal };
    }

    case 'remove': {
      const nextItems = state.items
        .map((item) =>
          item.id === action.dishId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0);

      const nextTotal = nextItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return { items: nextItems, total: nextTotal };
    }

    case 'clear':
      return initialCartState;

    default:
      return state;
  }
}
