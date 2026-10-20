"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export default function CreatePostModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
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
            <div
                className="bg-container-primary flex h-fit w-full max-w-md flex-col rounded-lg p-4 shadow-xl"
            >
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
                        Create a post by filling out the form below. Images are optional.
                    </p>
                </div>
            </div>
        </div>
    );
}
