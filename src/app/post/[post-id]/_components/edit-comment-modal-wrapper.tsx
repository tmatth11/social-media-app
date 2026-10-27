"use client";

import { useState } from "react";
import { SquarePen } from "lucide-react";
import { Comment } from "@/types"; 
import EditCommentModal from "./edit-comment-modal";

export default function EditCommentModalWrapper({
    comment,
}: {
    comment: Comment;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                className="edit-icon"
                aria-label="Edit comment"
                title="Edit comment"
                onClick={() => setIsModalOpen(true)}
            >
                <SquarePen />
            </button>
            {isModalOpen && (
                <EditCommentModal
                    key={`edit-comment-${isModalOpen}`}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    comment={comment}
                />
            )}
        </>
    );
}
