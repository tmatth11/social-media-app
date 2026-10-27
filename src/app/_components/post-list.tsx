import { getPosts } from "@/utils/queries/posts";
import PostCard from "./post-card";

export default async function PostList({
    profileId,
    currentPage,
}: {
    profileId?: string;
    currentPage: number;
}) {
    const { data: posts, error: postsError } = await getPosts(
        currentPage,
        profileId,
    );

    if (postsError || !posts) {
        return <p className="text-center form-error">An error has occured fetching posts.</p>
    }

    if (posts.length === 0) {
        return <p className="text-center">There are no posts to display.</p>
    }

    return (
        <div className="flex flex-col divide-y">
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    currentPage={currentPage}
                />
            ))}
        </div>
    );
}
