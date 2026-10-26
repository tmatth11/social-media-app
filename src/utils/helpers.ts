import { PostPageProps, ProfilePageProps } from "@/types";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getProfile } from "./queries/profiles";
import z from "zod";
import { getPost } from "./queries/posts";

const IdParamSchema = z.coerce.string().pipe(z.uuid());

export const getCachedProfile = cache(
    async (paramsPromise: ProfilePageProps["params"]) => {
        const resolvedParams = await paramsPromise;
        const result = IdParamSchema.safeParse(resolvedParams["profile-id"]);

        if (!result.success) {
            notFound();
        }

        const profileId = result.data;

        const { data: profile, error } = await getProfile(profileId);

        if (error || !profile) {
            notFound();
        }

        return profile;
    },
);

export const getCachedPost= cache(
    async (paramsPromise: PostPageProps["params"]) => {
        const resolvedParams = await paramsPromise;
        const result = IdParamSchema.safeParse(resolvedParams["post-id"]);

        if (!result.success) {
            notFound();
        }

        const postId = result.data;

        const { data: post, error } = await getPost(postId);

        if (error || !post) {
            notFound();
        }

        return post;
    },
);