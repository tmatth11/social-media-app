import { Comment } from "@/types";

export default async function CommentCard({
    comment,
    currentPage,
}: {
    comment: Comment,
    currentPage?: number;
}) {
    return (
        <>
            <p>CommentCard works!</p>
        </>
    )
}