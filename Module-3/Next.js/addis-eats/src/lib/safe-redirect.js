const APP_ORIGIN = "http://addis-eats.local";

export function getSafeRedirectPath(value, fallback = "/checkout") {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return fallback;
  }

  const destination = new URL(value, APP_ORIGIN);
  return destination.origin === APP_ORIGIN ? value : fallback;
}
