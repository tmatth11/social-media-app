import { toggleReaction } from "@/actions/reaction-actions";
import { Post } from "@/types";
import { ThumbsUp } from "lucide-react";

export default function LikeButton({
    post,
    cantReact,
}: {
    post: Post;
    cantReact: boolean;
}) {
    const toggleReactionAction = toggleReaction.bind(
        null,
        post.id,
        post.currentUserReaction,
        "like",
        post.user_id,
    );

    return (
        <form action={toggleReactionAction}>
            <button className="reaction-icon" disabled={cantReact} title="Like post" aria-label="Like post">
                <ThumbsUp className={`${post.hasLiked && "fill-reaction"}`} />
                {post.likes}
            </button>
        </form>
    );
}
