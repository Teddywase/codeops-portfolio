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
import { getDish as findMenuDish, getDishes } from "./menu";
import { ORDER_NEIGHBORHOODS } from "./schema";

// 

// In-memory orders store
const ordersStoreKey = Symbol.for("addis-eats.mockOrders");
const mockOrders =
  globalThis[ordersStoreKey] ?? (globalThis[ordersStoreKey] = []);
const orderStatusSubscribersKey = Symbol.for(
  "addis-eats.orderStatusSubscribers",
);
const orderStatusSubscribers =
  globalThis[orderStatusSubscribersKey] ??
  (globalThis[orderStatusSubscribersKey] = new Map());

const demoUsersStoreKey = Symbol.for("addis-eats.demoUsers");
const demoUsers =
  globalThis[demoUsersStoreKey] ??
  (globalThis[demoUsersStoreKey] = [
    {
      id: "user_addis_staff_101",
      name: "Addis Eats Kitchen",
      email: "kitchen@example.com",
      role: "staff",
      passwordSalt: "addis-eats-staff-v1",
      passwordHash:
        "4bb6f52154b0ad24052219d276aae79b8a5b97cc496d8317d55da72601ba1c64ae404ce381e87620ae49f5d32303d1deec77a0782b31a4424edb200348ae4f35",
    },
  ]);
const retiredDemoCustomerIds = new Set(["user_addis_101", "user_addis_102"]);
for (let index = demoUsers.length - 1; index >= 0; index -= 1) {
  if (retiredDemoCustomerIds.has(demoUsers[index].id)) {
    demoUsers.splice(index, 1);
  }
}

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
    findMany: async () => getDishes(),
    findUnique: async ({ where }) => findMenuDish(where.id),
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
  return findMenuDish(id);
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

export function subscribeToOrderStatus(id, listener) {
  let listeners = orderStatusSubscribers.get(id);
  if (!listeners) {
    listeners = new Set();
    orderStatusSubscribers.set(id, listeners);
  }

  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      orderStatusSubscribers.delete(id);
    }
  };
}

function publishOrderStatus(order) {
  const listeners = orderStatusSubscribers.get(order.id);
  if (!listeners) {
    return;
  }

  const status = {
    id: order.id,
    status: order.status,
    updatedAt: order.updatedAt ?? order.createdAt,
  };

  for (const listener of listeners) {
    listener(status);
  }
}

export async function getOrdersFor(userId) {
  return db.order.findMany({ where: { userId } });
}

export async function getKitchenDashboardData({
  sort = "createdAt",
  direction = "desc",
  page = 1,
  pageSize = 10,
} = {}) {
  const allowedSorts = new Set([
    "createdAt",
    "name",
    "neighborhood",
    "status",
    "total",
  ]);
  const sortKey = allowedSorts.has(sort) ? sort : "createdAt";
  const sortDirection = direction === "asc" ? 1 : -1;
  const safePage = Number.isSafeInteger(page) && page > 0 ? page : 1;
  const safePageSize =
    Number.isSafeInteger(pageSize) && pageSize > 0 ? pageSize : 10;
  const orders = mockOrders.map((order) => ({
    ...order,
    items: order.items?.map((item) => ({ ...item })),
  }));
  const sortValue = (order) =>
    sortKey === "createdAt"
      ? order.createdAt
      : sortKey === "total"
        ? order.total
        : order[sortKey] ?? "Unspecified";
  const sortOrders = orders.slice().sort((left, right) => {
    const leftValue = sortValue(left);
    const rightValue = sortValue(right);
    const comparison =
      typeof leftValue === "number" && typeof rightValue === "number"
        ? leftValue - rightValue
        : String(leftValue).localeCompare(String(rightValue));

    return comparison === 0
      ? left.id.localeCompare(right.id) * sortDirection
      : comparison * sortDirection;
  });

  const revenueByNeighborhood = new Map(
    ORDER_NEIGHBORHOODS.map((neighborhood) => [neighborhood, 0]),
  );
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const daysByDate = new Map();

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() - offset);
    const dateKey = date.toISOString().slice(0, 10);
    daysByDate.set(dateKey, {
      date: dateKey,
      label: new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }).format(date),
      orders: 0,
    });
  }

  for (const order of orders) {
    const createdAt = new Date(order.createdAt);
    if (!Number.isNaN(createdAt.getTime())) {
      const day = daysByDate.get(createdAt.toISOString().slice(0, 10));
      if (day) {
        day.orders += 1;
      }
    }

    if (order.status === "CANCELLED") {
      continue;
    }

    const neighborhood = ORDER_NEIGHBORHOODS.includes(order.neighborhood)
      ? order.neighborhood
      : "Unspecified";
    revenueByNeighborhood.set(
      neighborhood,
      (revenueByNeighborhood.get(neighborhood) ?? 0) + order.total,
    );
  }

  const total = sortOrders.length;
  const totalPages = Math.ceil(total / safePageSize);
  const currentPage = Math.min(safePage, totalPages || 1);
  const start = (currentPage - 1) * safePageSize;

  return {
    orders: sortOrders.slice(start, start + safePageSize),
    total,
    page: currentPage,
    pageSize: safePageSize,
    totalPages,
    revenueByNeighborhood: Array.from(
      revenueByNeighborhood,
      ([neighborhood, value]) => ({ neighborhood, value }),
    ),
    ordersByDay: Array.from(daysByDate.values()),
  };
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
  publishOrderStatus(order);
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

export async function registerUser(name, email, password) {
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 80 ||
    email.trim().length > 254 ||
    password.length < 8 ||
    password.length > 128
  ) {
    throw new Error("Registration details are invalid.");
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (demoUsers.some((user) => user.email === normalizedEmail)) {
    return null;
  }

  const passwordSalt = randomBytes(16).toString("hex");
  const passwordHash = scryptSync(password, passwordSalt, 64).toString("hex");
  const user = {
    id: `user_${randomUUID()}`,
    name: name.trim(),
    email: normalizedEmail,
    role: "customer",
    passwordSalt,
    passwordHash,
  };

  demoUsers.push(user);
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