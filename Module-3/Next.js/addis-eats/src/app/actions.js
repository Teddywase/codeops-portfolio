"use server";

import { revalidatePath } from "next/cache";
import {
  getOrder,
  markCancelled,
} from "../lib/db";
import { orderSchema } from "../lib/schema";
import { getSession } from "../lib/session";
import {
  createCustomerOrder,
  OrderRequestError,
  UnauthenticatedOrderError,
} from "../lib/orders";

function getFormString(formData, fieldName) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value : "";
}

function getFieldErrors(error) {
  return error.flatten().fieldErrors;
}

export async function placeOrder(_previousState, formData) {
  let items;

  try {
    items = JSON.parse(getFormString(formData, "items"));
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }

    return {
      error: "Your cart could not be read. Please refresh the page and try again.",
      fieldErrors: { items: ["Your cart data is invalid."] },
    };
  }

  const parsedOrder = orderSchema.safeParse({
    name: getFormString(formData, "name"),
    phone: getFormString(formData, "phone"),
    neighborhood: getFormString(formData, "neighborhood"),
    address: getFormString(formData, "address"),
    notes: getFormString(formData, "notes"),
    requestId: getFormString(formData, "requestId"),
    items,
  });

  if (!parsedOrder.success) {
    return {
      error: "Check the highlighted fields and try again.",
      fieldErrors: getFieldErrors(parsedOrder.error),
    };
  }

  try {
    const order = await createCustomerOrder(parsedOrder.data);
    revalidatePath("/menu");
    revalidatePath("/cart");
    revalidatePath("/checkout");
    revalidatePath("/orders");
    revalidatePath("/kitchen");

    return { order };
  } catch (error) {
    if (error instanceof OrderRequestError) {
      return {
        error: error.message,
        fieldErrors: error.fieldErrors,
        refreshRequestId: error.refreshRequestId,
      };
    }

    if (error instanceof UnauthenticatedOrderError) {
      return { error: error.message, fieldErrors: {} };
    }

    console.error("Could not place the order.", error);
    return {
      error: "We could not place your order. Please try again.",
      fieldErrors: {},
    };
  }
}

export async function cancelOrder(_previousState, formData) {
  const orderId = getFormString(formData, "orderId");

  if (!orderId) {
    return { error: "An order ID is required." };
  }

  const session = await getSession();

  if (!session?.id) {
    return { error: "Sign in before cancelling an order." };
  }

  const order = await getOrder(orderId);

  if (!order || order.userId !== session.id || order.status !== "PENDING") {
    return { error: "This order cannot be cancelled." };
  }

  try {
    await markCancelled(orderId);
    revalidatePath("/cart");
    revalidatePath("/checkout");
    revalidatePath("/orders");
    revalidatePath("/kitchen");
    return { success: true, message: "Your order was cancelled." };
  } catch (error) {
    console.error("Could not cancel the order.", error);
    return { error: "We could not cancel your order. Please try again." };
  }
}
