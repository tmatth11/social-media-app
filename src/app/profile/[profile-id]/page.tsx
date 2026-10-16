import { ProfilePageProps } from "@/types";
import { notFound } from "next/navigation";
import z from "zod";
import { cache } from "react";
import { getProfile } from "@/utils/queries/profiles";
import { connection } from "next/server";

export const instant = false;

const IdParamSchema = z.coerce.string().pipe(z.uuid());

const getCachedProfileId = cache(
    async (paramsPromise: ProfilePageProps["params"]) => {
        const resolvedParams = await paramsPromise;
        const result = IdParamSchema.safeParse(resolvedParams["profile-id"]);

        if (!result.success) {
            notFound();
        }

        return result.data;
    },
);

const getCachedProfile = cache(
    async (paramsPromise: ProfilePageProps["params"]) => {
        const profileId = await getCachedProfileId(paramsPromise);

        const { data: profile, error } = await getProfile(profileId);

        if (error || !profile) {
            notFound();
        }

        return profile;
    },
);

export async function generateMetadata({ params }: ProfilePageProps) {
    await connection();

    const { username } = await getCachedProfile(params);

    return {
        title: `${username}'s Profile`,
        description: `This page contains profile data and posts from ${username}`,
    };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    await connection();

    return <div className="flex flex-col p-4"></div>;
}
