import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import ShareCard from "./components/ShareCard";

export const alt = "Addis Eats Ethiopian cuisine";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function OpenGraphImage() {
  const image = await readFile(
    join(process.cwd(), "public", "assets", "hero.jpg"),
  );
  const imageSrc = `data:image/png;base64,${image.toString("base64")}`;

  return new ImageResponse(
    (
      <ShareCard
        eyebrow="Authentic Ethiopian cuisine"
        title="Addis Eats"
        description="Discover Ethiopian dishes and browse the Addis Eats menu."
        image={imageSrc}
      />
    ),
    size,
  );
}
