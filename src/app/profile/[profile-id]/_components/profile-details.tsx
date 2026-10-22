import { Profile } from "@/types";
import Image from "next/image";
import EditProfileModalWrapper from "./edit-profile-modal-wrapper";

export default async function ProfileDetails({
    profile,
    isOwner,
}: {
    profile: Profile;
    isOwner: boolean;
}) {
    return (
        <div className="flex flex-col items-center gap-2 p-4 md:fixed">
            <Image
                unoptimized
                className="h-25 rounded-full object-cover"
                src={profile.avatar_url ? profile.avatar_url : "/blank-user"}
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
