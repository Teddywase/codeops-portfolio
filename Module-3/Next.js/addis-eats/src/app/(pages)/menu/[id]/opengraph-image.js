import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import ShareCard from "../../../components/ShareCard";
import { formatEtb } from "../../../../lib/format";
import { getDish } from "../../../../lib/menu";

export const alt = "Ethiopian food from Addis Eats";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function OpenGraphImage({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) {
    return new Response("Dish not found.", { status: 404 });
  }

  const imageData =
    /^\/assets\/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png)$/i.test(dish.image || "")
      ? await readFile(
          join(process.cwd(), "public", dish.image.slice(1)),
        )
      : null;
  const imageType =
    imageData?.[0] === 0x89 &&
    imageData?.[1] === 0x50 &&
    imageData?.[2] === 0x4e &&
    imageData?.[3] === 0x47
      ? "image/png"
      : imageData?.[0] === 0xff && imageData?.[1] === 0xd8
        ? "image/jpeg"
        : null;
  const imageSrc = imageType
    ? `data:${imageType};base64,${imageData.toString("base64")}`
    : null;

  return new ImageResponse(
    (
      <ShareCard
        eyebrow={dish.category}
        title={dish.nameEn}
        description={dish.tagline || dish.description}
        image={imageSrc}
        price={formatEtb(dish.price)}
      />
    ),
    size,
  );
}
