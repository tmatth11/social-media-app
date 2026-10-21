import { getPosts } from "@/utils/queries/posts";
import CreatePostModalWrapper from "./create-post-modal-wrapper";
import PostList from "./post-list";

const INITIAL_NUMBER_OF_POSTS = 10;

export default async function Feed({ canPost }: { canPost: boolean }) {
    const { data: initialPosts, error } = await getPosts(
        0,
        INITIAL_NUMBER_OF_POSTS,
    );

    let message = "";

    if (error) {
        message = error.message;
    }

    if (initialPosts.length === 0) {
        message = "There are no posts to display.";
    }

    return (
        <div className="flex w-full flex-col">
            {/* Feed header */}
            <div className="flex flex-col items-center gap-2 p-4 md:flex-row md:justify-between">
                <h2>Feed</h2>
                {canPost && <CreatePostModalWrapper />}
            </div>
            {message === "" ? (
                <PostList
                    initialPosts={initialPosts}
                />
            ) : (
                <p className="text-center">{message}</p>
            )}
        </div>
    );
}
