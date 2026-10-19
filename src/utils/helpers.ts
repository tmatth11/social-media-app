import { ProfilePageProps } from "@/types";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getProfile } from "./queries/profiles";
import z from "zod";

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