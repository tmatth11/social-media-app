import { ProfilePageProps } from "@/types";
import { notFound } from "next/navigation";
import z from "zod";
import { cache } from "react";
import { getProfile } from "@/utils/queries/profiles";
import { connection } from "next/server";
import ProfileDetails from "./_components/profile-details";
import Feed from "@/app/_components/feed";
import { createClient } from "@/services/supabase/server";

export const instant = false;

const IdParamSchema = z.coerce.string().pipe(z.uuid());

const getCachedProfile = cache(
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

    const profile = await getCachedProfile(params);

    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    let isOwner = false;

    if (!error && user && user.id === profile.id) {
        isOwner = true;
    }

    return (
        <div className="flex flex-col items-center">
            <div className="bg-container-primary grid w-full grid-cols-1 md:max-w-3xl md:grid-cols-3">
                <div className="border-b-2 md:col-span-1 md:border-r-2 md:border-b-0">
                    <ProfileDetails profile={profile} isOwner={isOwner} />
                </div>
                <div className="md:col-span-2">
                    <Feed />
                </div>
            </div>
        </div>
    );
}
