import type { MetadataRoute } from "next";
import { getProfileIds } from "../utils/queries/profiles";
import { getPostIds } from "../utils/queries/posts";
import { getDeploymentURL } from "@/utils/helpers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const BASE_URL = getDeploymentURL();
    const FEED_URL = BASE_URL + "/feed";
    const PROFILES_URL = BASE_URL + "/profiles";
    const PROFILE_URL = BASE_URL + "/profile";
    const POST_URL = BASE_URL + "/post";

    const [postIds, profileIds] = await Promise.all([
        getProfileIds(),
        getPostIds(),
    ]);

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: FEED_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: PROFILES_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
    ];

    const postRoutes: MetadataRoute.Sitemap = postIds.map(({ id }) => ({
        url: `${POST_URL}/${id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    const profileRoutes: MetadataRoute.Sitemap = profileIds.map(({ id }) => ({
        url: `${PROFILE_URL}/${id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    return [...staticRoutes, ...postRoutes, ...profileRoutes];
}
