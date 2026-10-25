import { toggleReaction } from "@/actions/reaction-actions";
import { Post } from "@/types";
import { ThumbsDown } from "lucide-react";

export default function DislikeButton({ post }: { post: Post }) {
    const toggleReactionAction = toggleReaction.bind(
        null,
        post.id,
        post.currentUserReaction,
        "dislike",
        post.user_id,
    );

    return (
        <form action={toggleReactionAction}>
            <button className="reaction-icon">
                <ThumbsDown className={`${post.hasDisliked && "fill-reaction"}`} />
                {post.dislikes}
            </button>
        </form>
    );
}
