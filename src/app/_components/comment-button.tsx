import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function CommentButton({
    postId,
    numberOfComments,
}: {
    postId: string;
    numberOfComments: number;
}) {
    return (
        <Link href={`/post/${postId}?comment-box=open`} className="reaction-icon">
            <MessageCircle />
            {numberOfComments}
        </Link>
    );
}
