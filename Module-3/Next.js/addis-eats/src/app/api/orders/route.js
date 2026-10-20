import { orderSchema } from "../../../lib/schema";
import {
  createCustomerOrder,
  OrderRequestError,
  UnauthenticatedOrderError,
} from "../../../lib/orders";

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }

    return Response.json(
      { error: "Request body must contain valid JSON.", fieldErrors: {} },
      { status: 400 },
    );
  }

  const parsedOrder = orderSchema.safeParse(body);

  if (!parsedOrder.success) {
    return Response.json(
      {
        error: "Validation failed.",
        fieldErrors: parsedOrder.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  try {
    const order = await createCustomerOrder(parsedOrder.data);
    return Response.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof OrderRequestError) {
      return Response.json(
        { error: error.message, fieldErrors: error.fieldErrors },
        { status: 422 },
      );
    }

    if (error instanceof UnauthenticatedOrderError) {
      return Response.json(
        { error: error.message, fieldErrors: {} },
        { status: 401 },
      );
    }

    console.error("Could not create order through the orders API.", error);
    return Response.json(
      { error: "The order could not be created.", fieldErrors: {} },
      { status: 500 },
    );
  }
}
