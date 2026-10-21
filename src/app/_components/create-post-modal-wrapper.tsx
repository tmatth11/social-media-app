"use client";

import { useState } from "react";
import CreatePostModal from "./create-edit-post-modal";

export default function CreatePostModalWrapper({}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
            >
                Create Post
            </button>
            {isModalOpen && (
                <CreatePostModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
}
