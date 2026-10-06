import Link from "next/link";
import { notFound } from "next/navigation";

const dishes = [
  { id: "kitfo", name: "Kitfo", price: 340, description: "Minced beef with mitmita and injera." },
  { id: "shiro", name: "Shiro", price: 290, description: "Hearty chickpea stew served with warm injera." },
  { id: "doro", name: "Doro Wat", price: 360, description: "Traditional chicken stew with a hard-boiled egg." },
  { id: "alcha", name: "Alcha Tibs", price: 320, description: "Sautéed beef with onions, peppers, and spices." },
];

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = dishes.find((item) => item.id === id);

  if (!dish) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
          Addis Eats
        </p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">{dish.name}</h1>
        <p className="mt-4 text-lg text-slate-600">{dish.description}</p>

        <div className="mt-6 flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4">
          <div>
            <p className="text-sm text-slate-500">Price</p>
            <p className="text-2xl font-bold text-slate-900">${dish.price}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/menu"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Back to menu
            </Link>
            <Link
              href="/cart"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Add to cart
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
