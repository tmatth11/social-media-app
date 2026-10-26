import { toggleReaction } from "@/actions/reaction-actions";
import { Post } from "@/types";
import { ThumbsDown } from "lucide-react";

export default function DislikeButton({
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
        "dislike",
        post.user_id,
    );

    return (
        <form action={toggleReactionAction}>
            <button className="reaction-icon" disabled={cantReact} title="Dislike post" aria-label="Dislike post">
                <ThumbsDown
                    className={`${post.hasDisliked && "fill-reaction"}`}
                />
                {post.dislikes}
            </button>
        </form>
    );
}
