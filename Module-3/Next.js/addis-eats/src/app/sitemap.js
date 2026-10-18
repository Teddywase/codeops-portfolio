import { getDishes } from "../lib/menu";
import { absoluteUrl } from "../lib/site-url";

export default async function sitemap() {
  const dishes = await getDishes();

  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/menu"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...dishes.map((dish) => ({
      url: absoluteUrl(`/menu/${encodeURIComponent(dish.slug)}`),
      changeFrequency: "weekly",
      priority: 0.8,
      images: dish.image ? [absoluteUrl(dish.image)] : undefined,
    })),
  ];
}
