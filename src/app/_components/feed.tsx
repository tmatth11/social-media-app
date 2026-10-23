import { getPostsPages } from "@/utils/queries/posts";
import CreatePostModalWrapper from "./create-post-modal-wrapper";
import PostList from "./post-list";
import Pagination from "./pagination";
import { Suspense } from "react";

export default async function Feed({
    canPost,
    currentPage,
    profileId,
}: {
    canPost: boolean;
    currentPage: number;
    profileId?: string;
}) {
    const { success, data: totalPages } = await getPostsPages(profileId);

    return (
        <div className="bg-container-primary flex w-full flex-col rounded-md">
            <div className="flex flex-col items-center gap-2 p-4 md:flex-row md:justify-between">
                <h2>Feed</h2>
                {canPost && <CreatePostModalWrapper />}
            </div>
            {!success || totalPages === null ? (
                <p className="form-error text-center">An error has occurred</p>
            ) : (
                <div>
                    <Suspense
                        fallback={<p className="text-center">Loading...</p>}
                    >
                        <PostList
                            profileId={profileId}
                            currentPage={currentPage}
                        />
                    </Suspense>
                    <Pagination totalPages={totalPages} />
                </div>
            )}
        </div>
    );
}
