import { getDeploymentURL } from "@/utils/helpers";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const BASE_URL = getDeploymentURL();

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: "/private/",
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
