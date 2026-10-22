import { createClient } from "@/services/supabase/client";
import { Post } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function PostCard({
    id,
    content,
    image_url,
    user_id,
    author,
    likes,
    dislikes,
    comments,
    currentUserReaction,
    hasLiked,
    hasDisliked,
}: Post) {
    const supabase = createClient();

    const baseImageUrl = image_url
        ? supabase.storage.from("post_images").getPublicUrl(image_url).data
            .publicUrl
        : null;

    const imageSrc =
        baseImageUrl &&
        `${baseImageUrl}?t=${new Date(author.updated_at).getTime()}`;

    return (
        <div className="flex flex-col gap-2 border-b p-2 last:border-b-0">
            {/* Post header */}
            <div className="flex items-center gap-2">
                {/* Author avatar */}
                <Image
                    unoptimized
                    className="h-[50] rounded-full object-cover"
                    src={author.avatar_url ? author.avatar_url : "/blank-user.png"}
                    alt={`${author.username}'s profile picture`}
                    width={50}
                    height={50}
                />
                <div>
                    <Link
                        href={`/profile/${user_id}`}
                        className="text-sm hover:underline"
                    >
                        @{author.username}
                    </Link>
                    <span className="ml-2">{author.display_name}</span>
                </div>
            </div>
            <p>{content}</p>
            {imageSrc && (
                <Image
                    className="h-[200]"
                    unoptimized
                    src={imageSrc}
                    alt="Post image"
                    width={300}
                    height={400}
                />
            )}
        </div>
    );
}
