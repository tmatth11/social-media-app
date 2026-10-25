"use client";

import { deletePost } from "@/actions/post-actions";
import { Post } from "@/types";
import { Trash } from "lucide-react";
import { usePathname } from "next/navigation";
import { useActionState } from "react";

export default function DeletePostButton({
    post,
    currentPage
}: {
    post: Post;
    currentPage?: number;
}) {
    const [, formAction, isPending] = useActionState(deletePost, {
        success: false,
        message: "",
    });

    const pathname = usePathname();

    return (
        <form action={formAction}>
            <input type="hidden" name="post-id" value={post.id} />
            <input type="hidden" name="author-id" value={post.user_id} />
            {currentPage && <input type="hidden" name="current-page" value={currentPage} /> }
            <input type="hidden" name="pathname" value={pathname} />
            
            <button
                className="red-icon"
                aria-label="Delete post"
                title="Delete post"
                disabled={isPending}
            >
                <Trash />
            </button>
        </form>
    );
}
