import test from 'node:test';
import assert from 'node:assert/strict';
import { cartReducer, initialCartState } from './cartReducer.js';

test('add action adds a new dish and updates total', () => {
  const next = cartReducer(initialCartState, {
    type: 'add',
    dish: { id: 1, name: 'Doro Wat', price: 240 },
  });

  assert.deepEqual(next.items, [{ id: 1, name: 'Doro Wat', price: 240, quantity: 1 }]);
  assert.equal(next.total, 240);
});

test('add action increases quantity for an existing dish', () => {
  const state = {
    items: [{ id: 1, name: 'Doro Wat', price: 240, quantity: 1 }],
    total: 240,
  };

  const next = cartReducer(state, {
    type: 'add',
    dish: { id: 1, name: 'Doro Wat', price: 240 },
  });

  assert.deepEqual(next.items, [{ id: 1, name: 'Doro Wat', price: 240, quantity: 2 }]);
  assert.equal(next.total, 480);
});

test('remove action decreases quantity and removes the item when it reaches zero', () => {
  const state = {
    items: [{ id: 1, name: 'Doro Wat', price: 240, quantity: 2 }],
    total: 480,
  };

  const next = cartReducer(state, { type: 'remove', dishId: 1 });

  assert.deepEqual(next.items, [{ id: 1, name: 'Doro Wat', price: 240, quantity: 1 }]);
  assert.equal(next.total, 240);

  const cleared = cartReducer(next, { type: 'remove', dishId: 1 });
  assert.deepEqual(cleared.items, []);
  assert.equal(cleared.total, 0);
});

test('clear action empties the cart', () => {
  const state = {
    items: [
      { id: 1, name: 'Doro Wat', price: 240, quantity: 2 },
      { id: 2, name: 'Shiro', price: 120, quantity: 1 },
    ],
    total: 600,
  };

  const next = cartReducer(state, { type: 'clear' });
  assert.deepEqual(next.items, []);
  assert.equal(next.total, 0);
});
