import PostCard from "@/app/_components/post-card";
import { createClient } from "@/services/supabase/server";
import { PostPageProps } from "@/types";
import { getCachedPost } from "@/utils/helpers";
import { connection } from "next/server";
import CommentBox from "./_components/comment-box";

export const instant = false;

export async function generateMetadata({ params }: PostPageProps) {
    await connection();

    const { content, author } = await getCachedPost(params);

    const authorUsername = author.username;

    let pageTitle = content;
    const maxLength = 12;
    if (content.length > maxLength) {
        pageTitle = pageTitle.slice(0, 12) + "...";
    }

    return {
        title: pageTitle,
        description: `A post from ${authorUsername}`,
    };
}

export default async function PostPage({
    params,
    searchParams,
}: PostPageProps) {
    await connection();

    const userSearchParams = await searchParams;

    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    const commentBoxOpen = Boolean(
        userSearchParams?.["comment-box"] === "open" && !error && user,
    );

    const post = await getCachedPost(params);
    
    return (
        <div className="flex flex-col items-center p-2">
            <div className="w-full md:max-w-3xl">
                {/* Post card wrapper */}
                <div className="bg-container-primary rounded-md">
                    <PostCard post={post} />
                    {commentBoxOpen && <CommentBox postId={post.id} />}
                </div>
                {/* TODO: Create comment list */}
                
            </div>
        </div>
    );
}
