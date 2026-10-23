import { deletePost } from "@/actions/post-actions";
import { Post } from "@/types";
import { Trash } from "lucide-react";
import { useActionState, useEffect } from "react";

export default function DeletePostButton({
    post,
    onDelete,
}: {
    post: Post;
    onDelete: (id: string) => void;
}) {
    const [state, formAction, isPending] = useActionState(deletePost, {
        success: false,
        message: "",
    });

    useEffect(() => {
        if (state.success) {
            onDelete(post.id);
        }
    }, [state, post.id, onDelete])

    return (
        <form action={formAction}>
            <input type="hidden" name="post-id" value={post.id} />
            <input type="hidden" name="author-id" value={post.user_id} />
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
