import "server-only";

import { cache } from "react";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";

const menuDishSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  nameEn: z.string().min(1),
  nameAm: z.string().optional(),
  category: z.string().min(1),
  priceETB: z.number().finite().nonnegative(),
  spiceLevel: z.string().optional(),
  isFasting: z.boolean().optional(),
  isSpecial: z.boolean().optional(),
  image: z.string().optional(),
  description: z.string().min(1),
  ingredients: z.array(z.string()).optional(),
  servings: z.string().optional(),
  tagline: z.string().optional(),
});

const menuFileSchema = z.object({
  status: z.literal("ok"),
  data: z.array(menuDishSchema),
});

const readMenuData = cache(async () => {
  const filePath = join(process.cwd(), "public", "data", "menu.json");
  let contents;

  try {
    contents = await readFile(filePath, "utf8");
  } catch (error) {
    throw new Error(`Could not read the menu data at ${filePath}.`, {
      cause: error,
    });
  }

  let menuFile;

  try {
    menuFile = JSON.parse(contents);
  } catch (error) {
    throw new Error(`The menu data at ${filePath} is not valid JSON.`, {
      cause: error,
    });
  }

  const result = menuFileSchema.safeParse(menuFile);

  if (!result.success) {
    const issue = result.error.issues[0];
    const location = issue.path.length > 0 ? issue.path.join(".") : "root";
    throw new Error(
      `The menu data at ${filePath} is invalid at ${location}: ${issue.message}`,
      { cause: result.error },
    );
  }

  const dishes = result.data.data;
  const ids = new Set();
  const slugs = new Set();

  for (const dish of dishes) {
    if (ids.has(dish.id) || slugs.has(dish.slug)) {
      throw new Error(
        `The menu data at ${filePath} contains a duplicate dish ID or slug.`,
      );
    }

    ids.add(dish.id);
    slugs.add(dish.slug);
  }

  return dishes.map((dish) => ({
    ...dish,
    name: dish.nameEn,
    price: dish.priceETB,
    currency: "ETB",
    categoryId: dish.category
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
    available: true,
  }));
});

export async function getDishes() {
  return readMenuData();
}

export async function getDish(idOrSlug) {
  const dishes = await readMenuData();

  return dishes.find(
    (dish) => dish.id === idOrSlug || dish.slug === idOrSlug,
  ) ?? null;
}

export async function getDishCategories() {
  const dishes = await readMenuData();
  const categories = new Map();

  for (const dish of dishes) {
    if (!categories.has(dish.categoryId)) {
      categories.set(dish.categoryId, dish.category);
    }
  }

  return Array.from(categories, ([id, label]) => ({ id, label }));
}
