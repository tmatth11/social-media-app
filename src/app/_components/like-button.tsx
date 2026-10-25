import { toggleReaction } from "@/actions/reaction-actions";
import { Post } from "@/types";
import { ThumbsUp } from "lucide-react";

export default function LikeButton({ post }: { post: Post }) {
    const toggleReactionAction = toggleReaction.bind(
        null,
        post.id,
        post.currentUserReaction,
        "like",
        post.user_id,
    );

    return (
        <form action={toggleReactionAction}>
            <button className="reaction-icon">
                <ThumbsUp className={`${post.hasLiked && "fill-reaction"}`} />
                {post.likes}
            </button>
        </form>
    );
}
