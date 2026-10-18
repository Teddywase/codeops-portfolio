export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://addiseats.et",
);

export function absoluteUrl(path) {
  return new URL(path, siteUrl).toString();
}
