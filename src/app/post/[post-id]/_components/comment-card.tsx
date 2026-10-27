import { createClient } from "@/services/supabase/server";
import { Comment } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default async function CommentCard({
    comment,
    currentPage,
}: {
    comment: Comment;
    currentPage?: number;
}) {
    let isOwner = false;

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user && user.id === comment.user_id) {
        isOwner = true;
    }

    return (
        <div className="flex flex-col gap-2 p-2">
            {/* Comment header */}
            <div className="flex items-center gap-2">
                {/* Author avatar */}
                <Image
                    unoptimized
                    className="h-[50] rounded-full object-cover"
                    src={
                        comment.author.avatar_url
                            ? comment.author.avatar_url
                            : "/blank-user.png"
                    }
                    alt={`${comment.author.username}'s profile picture`}
                    width={50}
                    height={50}
                />
                {/* Author username */}
                <Link
                    href={`/profile/${comment.user_id}`}
                    className="text-sm hover:underline"
                >
                    @{comment.author.username}
                </Link>
                {/* Author display name*/}
                <span>{comment.author.display_name}</span>
            </div>
            <p>{comment.content}</p>
        </div>
    );
}
