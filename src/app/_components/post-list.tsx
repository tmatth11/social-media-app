"use client";

import { Post } from "@/types";
import { getPosts } from "@/utils/queries/posts";
import { useState, useTransition } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "./post-card";

const NUMBER_OF_POSTS_TO_FETCH = 10;

export default function PostList({ initialPosts }: { initialPosts: Post[] }) {
    const [offset, setOffset] = useState(NUMBER_OF_POSTS_TO_FETCH);
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [hasMore, setHasMore] = useState(
        initialPosts.length >= NUMBER_OF_POSTS_TO_FETCH,
    );
    const [isPending, startTransition] = useTransition();

    const { ref } = useInView({
        onChange: (inView) => {
            if (!inView || isPending || !hasMore) return;

            startTransition(async () => {
                const { data: newPosts, error } = await getPosts(
                    offset,
                    NUMBER_OF_POSTS_TO_FETCH,
                );

                if (error) return;

                if (newPosts.length < NUMBER_OF_POSTS_TO_FETCH) {
                    setHasMore(false);
                }

                setPosts((prev) => [...prev, ...newPosts]);
                setOffset((prev) => prev + NUMBER_OF_POSTS_TO_FETCH);
            });
        },
    });

    return (
        <div className="flex flex-col">
            {posts.map((post) => (
                <PostCard key={post.id} />
            ))}

            {hasMore && (
                <p
                    ref={ref}
                    className="mt-4 text-center"
                >
                    {isPending ? "Loading..." : ""}
                </p>
            )}
        </div>
    );
}
