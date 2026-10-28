import { Profile } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function ProfileCard({ profile }: { profile: Profile }) {
    return (
        <Link
            href={`/profile/${profile.id}`}
            className="flex items-center gap-2 p-2"
        >
            {/* Profile avatar */}
            <Image
                unoptimized
                className="h-[50] rounded-full object-cover"
                src={
                    profile.avatar_url ? profile.avatar_url : "/blank-user.png"
                }
                alt={`${profile.username}'s profile picture`}
                width={50}
                height={50}
            />
            <div>
                {/* Profile username */}
                <span className="text-sm hover:underline">
                    @{profile.username}
                </span>
                {/* Profile display name*/}
                <span className="ml-2">{profile.display_name}</span>
            </div>
        </Link>
    );
}
