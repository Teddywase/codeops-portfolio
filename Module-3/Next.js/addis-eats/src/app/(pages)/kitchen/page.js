import { notFound, redirect } from "next/navigation";
import { getSession } from "../../../lib/session";
import styles from "./kitchen.module.css";

export const metadata = {
  title: "Kitchen Dashboard",
  description: "Addis Eats staff kitchen dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function KitchenPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=%2Fkitchen");
  }

  if (session.role !== "staff") {
    notFound();
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Staff area</p>
        <h1 className={styles.heading}>Kitchen dashboard</h1>
        <p>Signed in as {session.name}.</p>
      </section>
    </main>
  );
}
