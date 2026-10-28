"use client";

import { createClient } from "@/services/supabase/client";
import { EditPostState, Post } from "@/types";
import { X } from "lucide-react";
import {
    useActionState,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import ImageUpload from "./image-upload";
import { editPost } from "@/actions/post-actions";

const initialState: EditPostState = {};

export default function EditPostModal({
    isOpen,
    onClose,
    post,
}: {
    isOpen: boolean;
    onClose: () => void;
    post: Post;
}) {
    const [content, setContent] = useState(post.content);
    const [imagePath, setImagePath] = useState<string | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(post.image_url);

    const [state, formAction, isPending] = useActionState<
        EditPostState,
        FormData
    >(editPost, initialState);

    const supabase = useMemo(() => createClient(), []);

    const handleCancelAndClose = useCallback(async () => {
        if (imagePath) {
            try {
                await supabase.storage.from("post_images").remove([imagePath]);
            } catch (error) {
                console.error(
                    "Failed to delete orphaned image from storage:",
                    error,
                );
            }
        }

        onClose();
    }, [imagePath, supabase, onClose]);

    useEffect(() => {
        if (state?.success) {
            onClose();
        }
    }, [onClose, state?.success]);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleCancelAndClose();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, handleCancelAndClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/50 p-4">
            <div
                key={`${post.id}-${isOpen}`}
                className="bg-container-primary flex w-full max-w-md flex-col rounded-lg p-4 shadow-xl overflow-y-auto h-fit"
            >
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleCancelAndClose}
                        aria-label="Close edit post modal"
                        title="Close edit post modal"
                        className="red-icon"
                    >
                        <X />
                    </button>
                </div>
                <div className="border-b">
                    <h3>Edit post</h3>
                    <p>Edit your post using the form below.</p>
                </div>
                <form action={formAction} className="flex flex-col">
                    <input type="hidden" name="post-id" value={post.id} />
                    <input
                        type="hidden"
                        name="author-id"
                        value={post.user_id}
                    />
                    <input
                        type="hidden"
                        name="image-url"
                        value={imagePreviewUrl || ""}
                    />
                    <div className="form-group">
                        {/* Post content input */}
                        <label className="form-group">
                            <span className="form-label">Post content</span>
                            <input
                                className="form-input"
                                id="content"
                                name="content"
                                type="text"
                                placeholder="Enter post content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <ImageUpload
                        key={`${post.id}-${isOpen}`}
                        url={imagePreviewUrl}
                        onUpload={(filePath, publicUrl) => {
                            setImagePath(filePath);
                            setImagePreviewUrl(publicUrl);
                        }}
                    />
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
