import { deletePost } from "@/actions/post-actions";
import { Trash } from "lucide-react";
import { useActionState, useEffect } from "react";

export default function DeletePostButton({
    postId,
    onDelete,
}: {
    postId: string;
    onDelete: (id: string) => void;
}) {
    const [state, formAction, isPending] = useActionState(deletePost, {
        success: false,
        message: "",
    });

    useEffect(() => {
        if (state.success) {
            onDelete(postId);
        }
    }, [state, postId, onDelete])

    return (
        <form action={formAction}>
            <input type="hidden" name="post-id" value={postId} />
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
