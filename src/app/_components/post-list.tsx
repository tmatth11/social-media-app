"use client";

import { Post } from "@/types";
import { getPosts } from "@/utils/queries/posts";
import { useEffect, useState, useTransition } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "./post-card";

const NUMBER_OF_POSTS_TO_FETCH = 10;

export default function PostList({ initialPosts }: { initialPosts: Post[] }) {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasMore && !isLoading) {
            const loadMorePosts = async () => {
                setIsLoading(true);
                const nextPage = page + 1;
                const { data: newPosts, error } = await getPosts(nextPage);

                if (error) {
                    setIsLoading(false);
                    return;
                }

                if (!newPosts || newPosts.length === 0) {
                    setHasMore(false);
                } else {
                    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
                    setPage(nextPage);

                    if (newPosts.length < NUMBER_OF_POSTS_TO_FETCH) {
                        setHasMore(false);
                    }
                }
                setIsLoading(false);
            };

            loadMorePosts();
        }
    }, [inView, page, hasMore, isLoading]);

    return (
        <div className="flex flex-col">
            {posts.map((post) => (
                <PostCard key={post.id} {...post} />
            ))}

            {hasMore && (
                <p ref={ref} className="mt-4 text-center">
                    Loading...
                </p>
            )}
        </div>
    );
}
