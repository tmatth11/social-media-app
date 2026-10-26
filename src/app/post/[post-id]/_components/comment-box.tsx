"use client";

import { createComment } from "@/actions/comment-actions";
import { CreateCommentState } from "@/types";
import { useActionState, useState } from "react";

const initialState: CreateCommentState = {};

export default function CommentBox({ postId }: { postId: string }) {
    const [comment, setComment] = useState("");

    const [state, formAction, isPending] = useActionState<
        CreateCommentState,
        FormData
    >(createComment, initialState);

    return (
        <div className="flex flex-col p-2 md:items-end">
            <div className="md:w-1/2">
                {/* Header */}
                <div className="flex flex-col">
                    <h4>Leave a comment</h4>
                    <p>Say something about this post.</p>
                </div>
                {/* Divider */}
                <hr className="mt-4 border-t" />
                {/* Comment form */}
                <form action={formAction} className="flex flex-col">
                    <input type="hidden" name="post-id" value={postId} />
                    {/* Comment input */}
                    <div className="form-group">
                        <label className="form-group">
                            <span className="form-label">Comment</span>
                            <textarea
                                className="form-input"
                                id="comment"
                                name="comment"
                                placeholder="Enter comment"
                                rows={3}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className="my-4 flex items-center justify-center">
                        {!state?.success && (
                            <p className="form-error">{state?.message}</p>
                        )}
                    </div>
                    {/* Submit button */}
                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={isPending || comment.trim() === ""}
                    >
                        {isPending ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
}
