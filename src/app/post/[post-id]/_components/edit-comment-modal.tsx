"use client";

import { editComment } from "@/actions/comment-actions";
import { EditCommentState, EditPostState, Comment } from "@/types";
import { X } from "lucide-react";
import {
    useActionState,
    useEffect,
    useState,
} from "react";

const initialState: EditCommentState = {};

export default function EditPostModal({
    isOpen,
    onClose,
    comment,
}: {
    isOpen: boolean;
    onClose: () => void;
    comment: Comment;
}) {
    const [content, setContent] = useState(comment.content);

    const [state, formAction, isPending] = useActionState<
        EditPostState,
        FormData
    >(editComment, initialState);

    useEffect(() => {
        if (state?.success) {
            onClose();
        }
    }, [onClose, state?.success]);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/50 p-4">
            <div
                key={`${comment.id}-${isOpen}`}
                className="bg-container-primary flex w-full max-w-md flex-col rounded-lg p-4 shadow-xl overflow-y-auto h-fit"
            >
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close edit post modal"
                        title="Close edit post modal"
                        className="red-icon"
                    >
                        <X />
                    </button>
                </div>
                <div className="border-b">
                    <h3>Edit comment</h3>
                    <p>Edit your comment using the form below.</p>
                </div>
                <form action={formAction} className="flex flex-col">
                    <input type="hidden" name="comment-id" value={comment.id} />
                    <input
                        type="hidden"
                        name="author-id"
                        value={comment.user_id}
                    />
                    <input
                        type="hidden"
                        name="post-id"
                        value={comment.post_id}
                    />
                    <div className="form-group">
                        {/* Comment content input */}
                        <label className="form-group">
                            <span className="form-label">Comment content</span>
                            <textarea
                                className="form-input"
                                id="content"
                                name="content"
                                placeholder="Enter display name"
                                value={content}
                                rows={3}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className="my-4 flex items-center justify-center">
                        {!state?.success && (
                            <p className="form-error">{state?.message}</p>
                        )}
                    </div>
                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={isPending || content.trim() === ""}
                    >
                        {isPending ? "Loading..." : "Edit"}
                    </button>
                </form>
            </div>
        </div>
    );
}
