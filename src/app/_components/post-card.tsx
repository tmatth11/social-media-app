import { Post } from "@/types";
import Image from "next/image";
import Link from "next/link";
import DeletePostButton from "./delete-post-button";
import EditPostModalWrapper from "./edit-post-modal-wrapper";
import { createClient } from "@/services/supabase/server";
import LikeButton from "./like-button";
import DislikeButton from "./dislike-button";

export default async function PostCard({
    post,
    currentPage,
}: {
    post: Post;
    currentPage?: number;
}) {
    let isOwner = false;

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user && user.id === post.user_id) {
        isOwner = true;
    }

    return (
        <div className="flex flex-col gap-2 border-b p-2 last:border-b-0">
            {/* Edit and delete buttons */}
            {isOwner && (
                <div className="flex items-center justify-end gap-1">
                    <EditPostModalWrapper post={post} />
                    <DeletePostButton post={post} currentPage={currentPage} />
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
            {/* User reactions */}
            <div className="flex items-center justify-end gap-2">
                <LikeButton post={post} />
                <DislikeButton post={post} />
            </div>
        </div>
    );
}
