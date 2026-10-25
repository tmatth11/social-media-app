"use client";

import { useState } from "react";
import CreatePostModal from "./create-post-modal";

export default function CreatePostModalWrapper() {
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
                    key={`create-post-${isModalOpen}`}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
}
