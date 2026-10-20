"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatEtb } from "../../../lib/formatting";
import styles from "./kitchen.module.css";

export default function OrderCharts({ revenueByNeighborhood, ordersByDay }) {
  const highestOrderValue = Math.max(
    1,
    ...revenueByNeighborhood.map(({ value }) => value),
  );
  const highestDailyOrderCount = Math.max(
    1,
    ...ordersByDay.map(({ orders }) => orders),
  );

  return (
    <div className={styles.charts}>
      <section className={styles.chartCard} aria-labelledby="neighborhood-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Order value · ETB</p>
            <h2 id="neighborhood-title">By neighborhood</h2>
          </div>
          <p className={styles.chartNote}>All non-cancelled orders</p>
        </div>
        <div
          className={styles.chart}
          role="img"
          aria-label="Bar chart of order value in Ethiopian birr by neighborhood. The same values are shown in the table below."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              accessibilityLayer
              data={revenueByNeighborhood}
              margin={{ top: 12, right: 12, bottom: 4, left: 12 }}
            >
              <CartesianGrid stroke="#eee5df" vertical={false} />
              <XAxis dataKey="neighborhood" tick={{ fill: "#66564f" }} />
              <YAxis
                allowDecimals={false}
                domain={[0, highestOrderValue]}
                tickFormatter={(value) => formatEtb(Number(value))}
                tick={{ fill: "#66564f" }}
                width={92}
              />
              <Tooltip
                formatter={(value) => [formatEtb(Number(value)), "Order value"]}
                labelFormatter={(label) => `Neighborhood: ${label}`}
              />
              <Bar dataKey="value" fill="#8f3a2c" name="Order value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.chartTableWrap}>
          <table className={styles.dataTable}>
            <caption>Total non-cancelled order value by neighborhood</caption>
            <thead>
              <tr>
                <th scope="col">Neighborhood</th>
                <th className={styles.numeric} scope="col">Order value (ETB)</th>
              </tr>
            </thead>
            <tbody>
              {revenueByNeighborhood.map(({ neighborhood, value }) => (
                <tr key={neighborhood}>
                  <th scope="row">{neighborhood}</th>
                  <td className={styles.numeric}>{formatEtb(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.chartCard} aria-labelledby="daily-orders-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Last 7 days · orders per day</p>
            <h2 id="daily-orders-title">Order activity</h2>
          </div>
          <p className={styles.chartNote}>Including cancelled orders</p>
        </div>
        <div
          className={styles.chart}
          role="img"
          aria-label="Line chart of daily order counts for the last seven days. The same values are shown in the table below."
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              accessibilityLayer
              data={ordersByDay}
              margin={{ top: 12, right: 16, bottom: 4, left: 4 }}
            >
              <CartesianGrid stroke="#eee5df" vertical={false} />
              <XAxis dataKey="label" interval={0} tick={{ fill: "#66564f" }} />
              <YAxis
                allowDecimals={false}
                domain={[0, highestDailyOrderCount]}
                tick={{ fill: "#66564f" }}
                width={36}
              />
              <Tooltip
                formatter={(value) => [Number(value), "Orders"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                dataKey="orders"
                dot={{ fill: "#235b50", r: 4 }}
                name="Orders"
                stroke="#235b50"
                strokeWidth={3}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.chartTableWrap}>
          <table className={styles.dataTable}>
            <caption>Daily orders during the last seven days</caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th className={styles.numeric} scope="col">Orders</th>
              </tr>
            </thead>
            <tbody>
              {ordersByDay.map(({ date, label, orders }) => (
                <tr key={date}>
                  <th scope="row">{label}</th>
                  <td className={styles.numeric}>{orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
