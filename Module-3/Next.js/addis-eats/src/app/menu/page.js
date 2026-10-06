import Link from "next/link";

const dishes = [
  { id: "kitfo", name: "Kitfo", price: 340, description: "Minced beef with mitmita and injera." },
  { id: "shiro", name: "Shiro", price: 290, description: "Hearty chickpea stew served with warm injera." },
  { id: "doro", name: "Doro Wat", price: 360, description: "Traditional chicken stew with a hard-boiled egg." },
  { id: "alcha", name: "Alcha Tibs", price: 320, description: "Sautéed beef with onions, peppers, and spices." },
];

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            Addis Eats
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Our menu</h1>
          <p className="mt-2 text-slate-600">Choose a dish to see its details.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {dishes.map((dish) => (
            <Link
              key={dish.id}
              href={`/menu/${dish.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900">{dish.name}</h2>
                <span className="rounded bg-amber-100 px-2 py-1 text-sm font-semibold text-amber-800">
                  ${dish.price}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{dish.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
