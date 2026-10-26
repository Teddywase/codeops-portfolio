import { getOrder, subscribeToOrderStatus } from "../../../../../lib/db";
import { getSession } from "../../../../../lib/session";

export const dynamic = "force-dynamic";

const encoder = new TextEncoder();
const noOperation = () => {};

function isTerminalStatus(status) {
  return status === "CANCELLED" || status === "DELIVERED";
}

export async function GET(request, { params }) {
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

  let cancelStream = noOperation;
  const stream = new ReadableStream({
    start(controller) {
      let closed = false;
      let unsubscribe = noOperation;
      let heartbeat;
      let abortHandler;

      const cleanup = () => {
        unsubscribe();
        clearInterval(heartbeat);
        if (abortHandler) {
          request.signal.removeEventListener("abort", abortHandler);
        }
      };
      cancelStream = () => {
        if (!closed) {
          closed = true;
          cleanup();
        }
      };
      const close = () => {
        if (closed) {
          return;
        }

        closed = true;
        cleanup();
        controller.close();
      };
      const send = (status) => {
        if (closed) {
          return;
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(status)}\n\n`),
        );
        if (isTerminalStatus(status.status)) {
          close();
        }
      };

      unsubscribe = subscribeToOrderStatus(id, send);
      heartbeat = setInterval(() => {
        if (!closed) {
          controller.enqueue(encoder.encode(": keep-alive\n\n"));
        }
      }, 20_000);
      abortHandler = cancelStream;
      request.signal.addEventListener("abort", abortHandler, { once: true });
      send({
        id: order.id,
        status: order.status,
        updatedAt: order.updatedAt ?? order.createdAt,
      });
    },
    cancel() {
      cancelStream();
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
      "X-Accel-Buffering": "no",
    },
  });
}