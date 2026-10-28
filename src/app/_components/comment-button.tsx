"use client";

import { MessageCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CommentButton({
    postId,
    numberOfComments,
    cantReact,
}: {
    postId: string;
    numberOfComments: number;
    cantReact: boolean;
}) {
    const { push } = useRouter();
    const searchParams = useSearchParams();
    const commentBoxOpen = searchParams.has("comment-box");

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (commentBoxOpen) {
            push(`/post/${postId}`);
        } else {
            push(`/post/${postId}?comment-box=open`);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={cantReact}
            className="reaction-icon"
        >
            <MessageCircle />
            {numberOfComments}
        </button>
    );
}
