import { ProfilePageProps } from "@/types";
import { connection } from "next/server";
import ProfileDetails from "./_components/profile-details";
import Feed from "@/app/_components/feed";
import { createClient } from "@/services/supabase/server";
import { getCachedProfile } from "@/utils/helpers";

export const instant = false;

export async function generateMetadata({ params }: ProfilePageProps) {
    await connection();

    const { username } = await getCachedProfile(params);

    return {
        title: `${username}'s Profile`,
        description: `This page contains profile data and posts from ${username}`,
    };
}

export default async function ProfilePage({ params, searchParams }: ProfilePageProps) {
    await connection();

    const userSearchParams = await searchParams;
    const currentPage = Number(userSearchParams?.page) || 1;

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
            <div className="mt-4 grid w-full grid-cols-1 p-2 md:max-w-3xl md:grid-cols-3">
                <div className="border-b-2 md:col-span-1 md:border-b-0">
                    <ProfileDetails profile={profile} isOwner={isOwner} />
                </div>
                <div className="md:col-span-2">
                    <Feed canPost={isOwner} profileId={profile.id} currentPage={currentPage} />
                </div>
            </div>
        </div>
    );
}
