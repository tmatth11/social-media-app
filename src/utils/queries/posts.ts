"use server";

// Source: https://medium.com/@ferlat.simon/infinite-scroll-with-nextjs-server-actions-a-simple-guide-76a894824cfd

import { createClient } from "@/services/supabase/server";

export const getPosts = async (offset: number, limit: number = 10) => {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;

    const from = (offset - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from("posts")
        .select(
            `
            id,
            updated_at,
            content,
            image_url,
            user_id,
            profiles:user_id (
                username,
                display_name,
                avatar_url
            ),
            likes:reactions!left(count),
            dislikes:reactions!left(count),
            comments(count),
            user_reaction:reactions!left(reaction_type)
        `,
            { count: "exact" },
        )
        .eq("likes.reaction_type", "like")
        .eq("dislikes.reaction_type", "dislike");

    if (userId) {
        query = query.eq("user_reaction.user_id", userId);
    }
    // Return impossible user_reaction user_id for users who are not logged in 
    else {
        query = query.eq(
            "user_reaction.user_id",
            "00000000-0000-0000-0000-000000000000",
        );
    }

    const { data, error } = await query
        .order("updated_at", {
            ascending: false,
        })
        .range(from, to);

    if (error) {
        console.error("Error:", error);

        return { data: null, error };
    }

    const formattedPosts =
        data?.map((post) => {
            const currentUserReactionType =
                post.user_reaction?.[0]?.reaction_type ?? null;

            return {
                id: post.id,
                updated_at: post.updated_at,
                content: post.content,
                image_url: post.image_url,
                user_id: post.user_id,
                author: post.profiles,
                likes: post.likes?.[0]?.count ?? 0,
                dislikes: post.dislikes?.[0]?.count ?? 0,
                comments: post.comments?.[0]?.count ?? 0,
                currentUserReaction: currentUserReactionType,
                hasLiked: currentUserReactionType === "like",
                hasDisliked: currentUserReactionType === "dislike",
            };
        }) ?? [];

    return { data: formattedPosts, error: null };
};
