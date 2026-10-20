"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import ImageUpload from "./image-upload";
import { createClient } from "@/services/supabase/client";

export default function CreateEditPostModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const supabase = useMemo(() => createClient(), []);

    const handleCancelAndClose = useCallback(async () => {
        if (imageUrl) {
            try {
                await supabase.storage.from("post_images").remove([imageUrl]);
            } catch (error) {
                console.error(
                    "Failed to delete orphaned image from storage:",
                    error,
                );
            }
        }

        setContent("");
        setImageUrl(null);
        onClose();
    }, [imageUrl, supabase, onClose]);

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
                        onClick={onClose}
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
                <form className="flex flex-col">
                    <input
                        type="hidden"
                        name="image-url"
                        value={imageUrl || ""}
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
                        url={imageUrl}
                        onUpload={(_event, filePath) => {
                            setImageUrl(filePath);
                        }}
                    />
                    <div className="my-4 flex items-center justify-center">
                        Error Message goes here
                    </div>
                    <button className="btn btn-primary" type="submit">
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
}
