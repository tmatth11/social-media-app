"use client";

import { useState } from "react";
import { SquarePen } from "lucide-react";
import EditPostModal from "./edit-post-modal";
import { Post } from "@/types";

export default function EditPostModalWrapper({ post }: { post: Post; }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                className="edit-icon"
                aria-label="Edit post"
                title="Edit post"
                onClick={() => setIsModalOpen(true)}
            >
                <SquarePen />
            </button>
            {isModalOpen && (
                <EditPostModal
                    key={`edit-post-${isModalOpen}`}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    post={post}
                />
            )}
        </>
    );
}
