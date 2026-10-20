import { notFound, redirect } from "next/navigation";
import { getKitchenDashboardData } from "../../../lib/db";
import { formatEtb } from "../../../lib/formatting";
import { getSession } from "../../../lib/session";
import KitchenOrderTable from "./KitchenOrderTable";
import OrderCharts from "./OrderCharts";
import styles from "./kitchen.module.css";

const sortableColumns = new Set([
  "createdAt",
  "name",
  "neighborhood",
  "status",
  "total",
]);

export const metadata = {
  title: "Kitchen Dashboard",
  description: "Order analytics and order management for Addis Eats staff.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function KitchenPage({ searchParams }) {
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=%2Fkitchen");
  }

  if (session.role !== "staff") {
    notFound();
  }

  const params = await searchParams;
  const sortValue = Array.isArray(params?.sort) ? params.sort[0] : params?.sort;
  const directionValue = Array.isArray(params?.dir) ? params.dir[0] : params?.dir;
  const pageValue = Array.isArray(params?.page) ? params.page[0] : params?.page;
  const sort = sortableColumns.has(sortValue) ? sortValue : "createdAt";
  const direction = directionValue === "asc" ? "asc" : "desc";
  const requestedPage = Number(pageValue);
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;
  const dashboard = await getKitchenDashboardData({ sort, direction, page });
  const activeOrderValue = dashboard.revenueByNeighborhood.reduce(
    (sum, row) => sum + row.value,
    0,
  );

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Staff dashboard</p>
            <h1 className={styles.heading}>Kitchen overview</h1>
            <p className={styles.description}>
              Welcome, {session.name}. Review order activity and customer orders.
            </p>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Non-cancelled order value</span>
            <strong>{formatEtb(activeOrderValue)}</strong>
            <span className={styles.summaryDetail}>Across all neighborhoods</span>
          </div>
        </header>

        <OrderCharts
          revenueByNeighborhood={dashboard.revenueByNeighborhood}
          ordersByDay={dashboard.ordersByDay}
        />

        <KitchenOrderTable
          orders={dashboard.orders}
          total={dashboard.total}
          page={dashboard.page}
          totalPages={dashboard.totalPages}
          sort={sort}
          direction={direction}
        />
      </div>
    </main>
  );
}
