"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function CreateEditPostModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/50 p-4">
            <div className="bg-container-primary flex h-fit w-full max-w-md flex-col rounded-lg p-4 shadow-xl">
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close edit profile modal"
                        title="Close edit profile modal"
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
                <form className="mt-4 flex flex-col">
                    <input
                        type="hidden"
                        name="image-url"
                        value={imageUrl || ""}
                    />
                    {/* ImageUploadComponent goes here */}
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
                    <div className="my-4 flex items-center justify-center">
                        Error Message goes here
                    </div>
                    <button
                        className="btn btn-primary"
                        type="submit"
                    >
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
}
