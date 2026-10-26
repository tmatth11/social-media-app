"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CommentBox from "./comment-box";

export default function CommentBoxWrapper({
    postId,
    commentBoxOpen,
}: {
    postId: string;
    commentBoxOpen: boolean;
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const closeCommentBox = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("comment-box");
        replace(`${pathname}`);
    };

    if (!commentBoxOpen) return null;

    return (
        <div className="flex flex-col gap-2 p-2">
            <button
                className="btn btn-primary w-1/6"
                onClick={() => closeCommentBox()}
            >
                Close
            </button>
            <CommentBox postId={postId} />
        </div>
    );
}
