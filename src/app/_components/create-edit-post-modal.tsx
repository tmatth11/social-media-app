"use client";

import { X } from "lucide-react";
import {
    useActionState,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import ImageUpload from "./image-upload";
import { createClient } from "@/services/supabase/client";
import { CreatePostState } from "@/types";
import { createPost } from "@/actions/post-actions";

const initialState: CreatePostState = {};

export default function CreateEditPostModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [content, setContent] = useState("");
    const [imagePath, setImagePath] = useState<string | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const [state, formAction, isPending] = useActionState<
        CreatePostState,
        FormData
    >(createPost, initialState);

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
        <div className="fixed inset-0 z-50 flex justify-center overflow-auto bg-black/50 p-4">
            <div className="bg-container-primary flex h-fit w-full max-w-md flex-col rounded-lg p-4 shadow-xl">
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleCancelAndClose}
                        aria-label="Close create post modal"
                        title="Close create post modal"
                        className="red-icon"
                    >
                        <X />
                    </button>
                </div>
                <div className="border-b">
                    <h3>Create post</h3>
                    <p>
                        Create a post by filling out the form below. Images are
                        optional.
                    </p>
                </div>
                <form action={formAction} className="flex flex-col">
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
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
}
