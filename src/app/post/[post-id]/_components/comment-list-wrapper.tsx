import Pagination from "@/app/_components/pagination";
import { getCommentsPages } from "@/utils/queries/comments";
import { Suspense } from "react";
import CommentList from "./comment-list";

export default async function CommentListWrapper({
    currentPage,
    postId,
}: {
    currentPage: number;
    postId: string;
}) {
    const { success, data: totalPages } = await getCommentsPages(postId);

    return (
        <div className="bg-container-primary mt-4 flex flex-col rounded-md">
            <h3 className="text-center p-2">Comments</h3>
            {!success || totalPages === null ? (
                <p className="form-error text-center">An error has occurred</p>
            ) : (
                <>
                    <Suspense
                        fallback={<p className="text-center">Loading...</p>}
                    >
                        <CommentList
                            postId={postId}
                            currentPage={currentPage}
                        />
                    </Suspense>
                    <Pagination totalPages={totalPages} />
                </>
            )}
        </div>
    );
}
