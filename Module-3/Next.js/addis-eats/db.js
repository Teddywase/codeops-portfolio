/**
 * In-memory mock database and helper utilities for Addis Eats.
 * Demo only: data resets when the server process restarts.
 */
import { randomUUID } from "node:crypto";

// Mock dish records
const mockDishes = [
  {
    id: "dish_1",
    name: "Doro Wat",
    description: "Traditional spicy chicken stew served with injera and boiled egg.",
    price: 350,
    currency: "ETB",
    category: "Main",
    available: true,
  },
  {
    id: "dish_2",
    name: "Beyaynetu",
    description: "Assorted vegan fasting dishes served on injera.",
    price: 220,
    currency: "ETB",
    category: "Vegetarian",
    available: true,
  },
  {
    id: "dish_3",
    name: "Kitfo",
    description: "Minced beef seasoned with mitmita and niter kibbeh.",
    price: 400,
    currency: "ETB",
    category: "Main",
    available: true,
  },
  {
    id: "dish_4",
    name: "Shiro Tegabeno",
    description: "Rich chickpea flour stew served bubbling hot in a clay pot.",
    price: 180,
    currency: "ETB",
    category: "Vegetarian",
    available: true,
  },
];

// In-memory orders store
const mockOrders = [];

// Mock authenticated user session
const mockSessionUser = {
  id: "user_addis_101",
  name: "Abebe Bikila",
  email: "abebe@example.com",
};

/**
 * ORM-style database query interface
 */
export const db = {
  dish: {
    findMany: async () => mockDishes.map((dish) => ({ ...dish })),
    findUnique: async ({ where }) =>
      mockDishes
        .filter((dish) => dish.id === where.id)
        .map((dish) => ({ ...dish }))[0] || null,
  },
  order: {
    findMany: async () => mockOrders.map((order) => ({ ...order })),
  },
};

/**
 * Fetch a single dish by ID
 */
export async function getDish(id) {
  const dish = mockDishes.find((dish) => dish.id === id);
  return dish ? { ...dish } : null;
}

/**
 * Create a new order in memory
 */
export async function createOrder(data, userId = mockSessionUser.id) {
  const newOrder = {
    id: `ord_${randomUUID()}`,
    ...data,
    status: "PENDING",
    userId,
    createdAt: new Date().toISOString(),
  };

  mockOrders.push(newOrder);
  return newOrder;
}

/**
 * Retrieve a specific order by ID
 */
export async function getOrder(id) {
  const order = mockOrders.find((order) => order.id === id);
  return order || null;
}

/**
 * Mark an order as cancelled
 */
export async function markCancelled(id) {
  const order = mockOrders.find((o) => o.id === id);
  if (!order || order.status !== "PENDING") {
    throw new Error("Only pending orders can be cancelled.");
  }

  order.status = "CANCELLED";
  order.updatedAt = new Date().toISOString();
  return order;
}

/**
 * Read current authenticated user session
 */
export async function getSession() {
  return mockSessionUser;
}