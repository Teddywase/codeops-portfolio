import { notFound } from "next/navigation";

const dishes = [
  { id: "kitfo", name: "Kitfo", price: 340, description: "Minced beef with mitmita and injera." },
  { id: "shiro", name: "Shiro", price: 290, description: "Hearty chickpea stew served with warm injera." },
  { id: "doro", name: "Doro Wat", price: 360, description: "Traditional chicken stew with hard-boiled egg." },
  { id: "alcha", name: "Alcha Tibs", price: 320, description: "Sautéed beef with onions, peppers, and spices." },
];

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = dishes.find((item) => item.id === id);

  if (!dish) {
    notFound();
  }

  return (
    <main>
      <div>
        <p>Addis Eats</p>
        <h1>{dish.name}</h1>
        <p>{dish.description}</p>

        <div>
          <div>
            <p>Price</p>
            <p>${dish.price}</p>
          </div>
          </div>
        </div>
    </main>
  );
}
