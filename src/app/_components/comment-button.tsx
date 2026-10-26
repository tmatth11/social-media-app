"use client";

import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

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

    return (
        <button
            onClick={() => push(`/post/${postId}?comment-box=open`)}
            disabled={cantReact}
            className="reaction-icon"
        >
            <MessageCircle />
            {numberOfComments}
        </button>
    );
}
