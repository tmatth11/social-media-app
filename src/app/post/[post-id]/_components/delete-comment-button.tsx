"use client";

import { deleteComment } from "@/actions/comment-actions";
import { Comment } from "@/types";
import { Trash } from "lucide-react";
import { usePathname } from "next/navigation";
import { useActionState } from "react";

export default function DeleteCommentButton({
    comment,
    currentPage
}: {
    comment: Comment;
    currentPage?: number;
}) {
    const [, formAction, isPending] = useActionState(deleteComment, {
        success: false,
        message: "",
    });

    const pathname = usePathname();

    return (
        <form action={formAction}>
            <input type="hidden" name="comment-id" value={comment.id} />
            <input type="hidden" name="post-id" value={comment.post_id} />
            <input type="hidden" name="author-id" value={comment.user_id} />
            {currentPage && <input type="hidden" name="current-page" value={currentPage} /> }
            <input type="hidden" name="pathname" value={pathname} />
            
            <button
                className="red-icon"
                aria-label="Delete comment"
                title="Delete comment"
                disabled={isPending}
            >
                <Trash />
            </button>
        </form>
    );
}
