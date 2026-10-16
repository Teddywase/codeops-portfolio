/**
 * In-memory mock database and helper utilities for Addis Eats.
 * Demo only: data resets when the server process restarts.
 */
import "server-only";
import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

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
const ordersStoreKey = Symbol.for("addis-eats.mockOrders");
const mockOrders =
  globalThis[ordersStoreKey] ?? (globalThis[ordersStoreKey] = []);

const demoUsers = [
  {
    id: "user_addis_101",
    name: "Abebe Bikila",
    email: "abebe@example.com",
    role: "customer",
    passwordSalt: "addis-eats-customer-v1",
    passwordHash:
      "b2efa0a5daaef9ac20b5044f8d7cd140b5bf90b843078a4c3c4952d40c0d17d0cf615cc2c6d6e816ddbcab9dc33600d25388770037c9e5187e618698f1cc6dbf",
  },
  {
    id: "user_addis_102",
    name: "Liya Mekonnen",
    email: "liya@example.com",
    role: "customer",
    passwordSalt: "addis-eats-customer-2-v1",
    passwordHash:
      "172785ee853047fad687245ffab7936fcb716051c848c070ee6dbdc0b8252f1f04c4223115d1d6dab76d072b0c4162c8ecb99992eb135d3dc90ff0e9c79d0d5d",
  },
  {
    id: "user_addis_staff_101",
    name: "Addis Eats Kitchen",
    email: "kitchen@example.com",
    role: "staff",
    passwordSalt: "addis-eats-staff-v1",
    passwordHash:
      "4bb6f52154b0ad24052219d276aae79b8a5b97cc496d8317d55da72601ba1c64ae404ce381e87620ae49f5d32303d1deec77a0782b31a4424edb200348ae4f35",
  },
];

const dummyPasswordSalt = "addis-eats-dummy-v1";
const dummyPasswordHash = Buffer.from(
  "be5e650e36e6bfce0a423791f36fb354f5efd432ba6cecdabc88a45c4ec99ba84f9cbe032389c9fe41a20ae0bca1204cb6ebe7da01e808aa63f953a1adba5ea3",
  "hex",
);
const sessionsStoreKey = Symbol.for("addis-eats.sessions");
const sessions =
  globalThis[sessionsStoreKey] ?? (globalThis[sessionsStoreKey] = new Map());

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
    findMany: async ({ where } = {}) => {
      if (typeof where?.userId !== "string" || !where.userId) {
        throw new Error("Order queries must be scoped to an authenticated user.");
      }

      return mockOrders
        .filter((order) => order.userId === where.userId)
        .map((order) => ({
          ...order,
          items: order.items?.map((item) => ({ ...item })),
        }));
    },
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
export async function createOrder(data, userId) {
  if (typeof userId !== "string" || !userId) {
    throw new Error("An authenticated user is required to create an order.");
  }

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

export async function getOrdersFor(userId) {
  return db.order.findMany({ where: { userId } });
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

export async function authenticateUser(email, password) {
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    password.length > 128
  ) {
    return null;
  }

  const user = demoUsers.find(
    (candidate) => candidate.email === email.trim().toLowerCase(),
  );
  const expectedHash = user
    ? Buffer.from(user.passwordHash, "hex")
    : dummyPasswordHash;
  const passwordHash = scryptSync(
    password,
    user?.passwordSalt ?? dummyPasswordSalt,
    expectedHash.length,
  );
  const passwordMatches = timingSafeEqual(passwordHash, expectedHash);

  if (!user || !passwordMatches) {
    return null;
  }

  const { passwordHash: _passwordHash, passwordSalt: _passwordSalt, ...safeUser } =
    user;
  return safeUser;
}

export async function createSession(userId) {
  const user = demoUsers.find((candidate) => candidate.id === userId);
  if (!user) {
    throw new Error("Cannot create a session for an unknown user.");
  }

  const token = randomBytes(32).toString("base64url");
  sessions.set(token, {
    userId,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  return token;
}

export async function getSessionByToken(token) {
  const session = sessions.get(token);
  if (!session) {
    return null;
  }

  if (session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }

  const user = demoUsers.find((candidate) => candidate.id === session.userId);
  if (!user) {
    sessions.delete(token);
    return null;
  }

  const { passwordHash: _passwordHash, passwordSalt: _passwordSalt, ...safeUser } =
    user;
  return safeUser;
}

export async function deleteSession(token) {
  sessions.delete(token);
}