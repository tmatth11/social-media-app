import { Post } from "@/types";
import { ThumbsDown, ThumbsUp } from "lucide-react";

export default function UserReactions({ post }: { post: Post }) {
    return (
        <div className="flex items-center justify-end gap-2">
            <div className="reaction-icon">
                <ThumbsUp />
                {post.likes}
            </div>
            <button className="reaction-icon">
                <ThumbsDown />
                {post.likes}
            </button>
        </div>
    );
}
