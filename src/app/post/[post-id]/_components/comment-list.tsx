import { getComments } from "@/utils/queries/comments";
import CommentCard from "./comment-card";

export default async function CommentList({
    postId,
    currentPage,
}: {
    postId: string;
    currentPage: number;
}) {
    const { data: comments, error: commentsError } = await getComments(
        currentPage,
        postId,
    );

    if (commentsError || !comments) {
        return (
            <p className="form-error text-center">
                An error has occured fetching comments.
            </p>
        );
    }

    if (comments.length === 0) {
        return (
            <p className="text-center">
                There are no comments to display.
            </p>
        );
    }

    return (
        <div className="flex flex-col divide-y">
            {comments.map((comment) => (
                <CommentCard
                    key={comment.id}
                    comment={comment}
                    currentPage={currentPage}
                />
            ))}
        </div>
    );
}
