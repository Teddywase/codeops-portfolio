import { absoluteUrl } from "../lib/site-url";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/cart",
        "/checkout",
        "/kitchen",
        "/orders",
        "/signin",
        "/signup",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
