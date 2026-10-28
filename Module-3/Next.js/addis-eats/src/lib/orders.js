import "server-only";

import { createOrder, OrderIdempotencyConflictError } from "./db";
import { getDish } from "./menu";
import { getSession } from "./session";

export class OrderRequestError extends Error {
  constructor(message, fieldErrors = {}, refreshRequestId = false) {
    super(message);
    this.name = "OrderRequestError";
    this.fieldErrors = fieldErrors;
    this.refreshRequestId = refreshRequestId;
  }
}

export class UnauthenticatedOrderError extends Error {
  constructor() {
    super("Sign in before placing an order.");
    this.name = "UnauthenticatedOrderError";
  }
}

export async function createCustomerOrder(data) {
  const session = await getSession();

  if (!session?.id) {
    throw new UnauthenticatedOrderError();
  }

  const dishes = await Promise.all(
    data.items.map(({ dishId }) => getDish(dishId)),
  );
  const unavailableItems = data.items.flatMap((item, index) =>
    !dishes[index]?.available ? [item.dishId] : [],
  );

  if (unavailableItems.length > 0) {
    throw new OrderRequestError("One or more dishes are unavailable.", {
      items: unavailableItems.map((dishId) => `Dish ${dishId} is unavailable.`),
    });
  }

  const items = data.items.map((item, index) => {
    const dish = dishes[index];

    return {
      dishId: dish.id,
      name: dish.name,
      quantity: item.quantity,
      unitPrice: dish.price,
      lineTotal: dish.price * item.quantity,
    };
  });
  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
  let order;
  try {
    order = await createOrder(
      {
        name: data.name,
        phone: data.phone,
        neighborhood: data.neighborhood,
        address: data.address,
        notes: data.notes,
        items,
        total,
        currency: "ETB",
      },
      session.id,
      data.requestId,
    );
  } catch (error) {
    if (error instanceof OrderIdempotencyConflictError) {
      throw new OrderRequestError(
        "This checkout attempt was already used with different details. Review your order and submit again.",
        {},
        true,
      );
    }

    throw error;
  }

  return {
    id: order.id,
    status: order.status,
    total: order.total,
    currency: order.currency,
    createdAt: order.createdAt,
  };
}
