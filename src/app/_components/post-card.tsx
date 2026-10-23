import { useUser } from "@/hooks/use-user";
import { Post } from "@/types";
import { SquarePen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DeletePostButton from "./delete-post-button";
import EditPostModalWrapper from "./edit-post-modal-wrapper";

export default function PostCard({
    post,
    onDelete,
    onEdit,
}: {
    post: Post;
    onDelete: (id: string) => void;
    onEdit: (
        id: string,
        newContent: string,
        newImageUrl: string | null,
    ) => void;
}) {
    const { user } = useUser();
    let isOwner = false;

    if (user && user.id === post.user_id) {
        isOwner = true;
    }

    return (
        <div className="flex flex-col gap-2 border-b p-2 last:border-b-0">
            {/* Edit and delete buttons */}
            {isOwner && (
                <div className="flex items-center justify-end gap-1">
                    <EditPostModalWrapper post={post} onEdit={onEdit} />
                    <DeletePostButton post={post} onDelete={onDelete} />
                </div>
            )}
            {/* Post header */}
            <div className="flex items-center gap-2">
                {/* Author avatar */}
                <Image
                    unoptimized
                    className="h-[50] rounded-full object-cover"
                    src={
                        post.author.avatar_url
                            ? post.author.avatar_url
                            : "/blank-user.png"
                    }
                    alt={`${post.author.username}'s profile picture`}
                    width={50}
                    height={50}
                />
                <div>
                    {/* Author username */}
                    <Link
                        href={`/profile/${post.user_id}`}
                        className="text-sm hover:underline"
                    >
                        @{post.author.username}
                    </Link>
                    {/* Author display name*/}
                    <span className="ml-2">{post.author.display_name}</span>
                </div>
            </div>
            {/* Post content */}
            <p className="break-all">{post.content}</p>
            {/* Post image */}
            {post.image_url && (
                <Image
                    className="h-[200]"
                    unoptimized
                    src={post.image_url}
                    alt="Post image"
                    width={300}
                    height={400}
                />
            )}
        </div>
    );
}
