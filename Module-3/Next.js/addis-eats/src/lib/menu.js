import "server-only";

const dishes = [
  {
    id: "kitfo",
    name: "Kitfo",
    price: 340,
    category: "raw",
    description: "Minced beef with mitmita and injera.",
  },
  {
    id: "shiro",
    name: "Shiro",
    price: 290,
    category: "vegan",
    description: "Hearty chickpea stew served with warm injera.",
  },
  {
    id: "doro",
    name: "Doro Wat",
    price: 360,
    category: "stews",
    description: "Traditional chicken stew with a hard-boiled egg.",
  },
  {
    id: "alcha",
    name: "Alcha Tibs",
    price: 320,
    category: "grills",
    description: "Sautéed beef with onions, peppers, and spices.",
  },
];

export async function getDishes() {
  return dishes;
}

export async function getDish(id) {
  return dishes.find((dish) => dish.id === id);
}
