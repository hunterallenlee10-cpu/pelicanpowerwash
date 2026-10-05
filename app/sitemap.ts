import type { MetadataRoute } from "next";
import { business } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: business.url, changeFrequency: "monthly", priority: 1 },
    { url: `${business.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
