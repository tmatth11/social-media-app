import { useUser } from "@/hooks/use-user";
import { Post } from "@/types";
import { SquarePen, Trash } from "lucide-react";
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
    const { user } = useUser();
    let isOwner = false;

    if (user && user.id === user_id) {
        isOwner = true;
    }

    return (
        <div className="flex flex-col gap-2 border-b p-2 last:border-b-0">
            {/* Edit and delete buttons */}
            {isOwner && (
                <div className="flex items-center justify-end gap-1">
                    <button 
                        className="edit-icon"
                        aria-label="Edit post"
                        title="Edit post"
                    >
                        <SquarePen />
                    </button>
                    <button 
                        className="red-icon"
                        aria-label="Delete post"
                        title="Delete post"
                    >
                        <Trash />
                    </button>
                </div>
            )}
            {/* Post header */}
            <div className="flex items-center gap-2">
                {/* Author avatar */}
                <Image
                    unoptimized
                    className="h-[50] rounded-full object-cover"
                    src={
                        author.avatar_url
                            ? author.avatar_url
                            : "/blank-user.png"
                    }
                    alt={`${author.username}'s profile picture`}
                    width={50}
                    height={50}
                />
                <div>
                    {/* Author username */}
                    <Link
                        href={`/profile/${user_id}`}
                        className="text-sm hover:underline"
                    >
                        @{author.username}
                    </Link>
                    {/* Author display name*/}
                    <span className="ml-2">{author.display_name}</span>
                </div>
            </div>
            {/* Post content */}
            <p className="break-all">{content}</p>
            {/* Post image */}
            {image_url && (
                <Image
                    className="h-[200]"
                    unoptimized
                    src={image_url}
                    alt="Post image"
                    width={300}
                    height={400}
                />
            )}
        </div>
    );
}
