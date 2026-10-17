import { Profile } from "@/types";
import Image from "next/image";
import EditProfileModalWrapper from "./edit-profile-modal-wrapper";

export default function ProfileDetails({
    profile,
    isOwner,
}: {
    profile: Profile;
    isOwner: boolean;
}) {
    
    return (
        <div className="flex flex-col items-center gap-2 p-4">
            <Image
                className="rounded-full"
                src={
                    profile.avatar_url ? profile.avatar_url : "/blank-user.png"
                }
                alt={`${profile.username}'s profile picture`}
                width="100"
                height="100"
            />
            <div>
                <h3>{profile.display_name}</h3>
                <p>@{profile.username}</p>
            </div>
            {isOwner && 
                <EditProfileModalWrapper />
            }
        </div>
    );
}
