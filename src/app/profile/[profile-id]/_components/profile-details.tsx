import { Profile } from "@/types";
import Image from "next/image";
import EditProfileModalWrapper from "./edit-profile-modal-wrapper";
import { createClient } from "@/services/supabase/server";

export default async function ProfileDetails({
    profile,
    isOwner,
}: {
    profile: Profile;
    isOwner: boolean;
}) {
    const supabase = await createClient();

    const baseAvatarUrl = profile.avatar_url
        ? supabase.storage.from("avatars").getPublicUrl(profile.avatar_url).data
            .publicUrl
        : null;

    const avatarSrc = baseAvatarUrl
        ? `${baseAvatarUrl}?t=${new Date(profile.updated_at).getTime()}`
        : "/blank-user.png";

    return (
        <div className="flex flex-col items-center gap-2 p-4">
            <Image
                unoptimized
                className="rounded-full object-cover h-25"
                src={avatarSrc}
                alt={`${profile.username}'s profile picture`}
                width={100}
                height={100}
            />
            <div>
                <h3>{profile.display_name}</h3>
                <p>@{profile.username}</p>
            </div>
            {isOwner && <EditProfileModalWrapper profile={profile} />}
        </div>
    );
}
