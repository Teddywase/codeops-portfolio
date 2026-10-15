import { getOrder, getSession } from "../../../../../db";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { id } = await params;
  const session = await getSession();

  if (!session?.id) {
    return Response.json(
      { error: "Sign in before viewing this order." },
      { status: 401 },
    );
  }

  const order = await getOrder(id);

  if (!order || order.userId !== session.id) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  return Response.json({
    id: order.id,
    status: order.status,
    updatedAt: order.updatedAt ?? order.createdAt,
  });
}
