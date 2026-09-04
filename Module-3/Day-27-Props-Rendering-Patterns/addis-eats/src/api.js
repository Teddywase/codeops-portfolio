export async function loadDishes(category = 'All', signal) {
  const response = await fetch('/api/dishes', { signal });

  if (!response.ok) {
    throw new Error('Could not load the Addis Eats menu.');
  }

  const data = await response.json();
  const dishes = data.map((dish) => ({
    ...dish,
    image: new URL(`./assets/${dish.image}`, import.meta.url).href,
  }));

  if (category === 'All') {
    return dishes;
  }

  return dishes.filter((dish) => dish.category === category);
}
