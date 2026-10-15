import { getDishPage, getDishes } from "../../../lib/menu";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "all";
  const requestedPage = searchParams.get("page");

  if (
    requestedPage !== null &&
    (!/^[1-9]\d*$/.test(requestedPage) ||
      !Number.isSafeInteger(Number(requestedPage)))
  ) {
    return Response.json(
      { error: "Page must be a positive integer." },
      { status: 400 },
    );
  }

  if (query.length > 100 || category.length > 100) {
    return Response.json(
      { error: "Search and category values must not exceed 100 characters." },
      { status: 400 },
    );
  }

  if (query || category !== "all" || requestedPage !== null) {
    return Response.json(
      await getDishPage({
        query,
        category,
        page: requestedPage ? Number(requestedPage) : 1,
      }),
    );
  }

  const dishes = await getDishes();
  return Response.json(dishes);
}
