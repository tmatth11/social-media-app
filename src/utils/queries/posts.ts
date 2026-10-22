"use server";

// Source: https://medium.com/@ferlat.simon/infinite-scroll-with-nextjs-server-actions-a-simple-guide-76a894824cfd

import { createClient } from "@/services/supabase/server";
import { Post } from "@/types";

export const getPosts = async (
    page: number,
    limit: number = 10,
    profileId?: string,
) => {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from("posts")
        .select(
            `
            id,
            content,
            image_url,
            user_id,
            profiles:user_id (
                username,
                display_name,
                avatar_url,
                updated_at
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

    // Query posts only from the provided profile ID
    if (profileId) {
        query = query.eq("user_id", profileId);
    }

    const { data, error } = await query
        .order("updated_at", {
            ascending: false,
        })
        .range(from, to);

    if (error) {
        console.error("Error:", error);

        return { data: [] as Post[], error };
    }

    const formattedPosts =
        data?.map((post) => {
            const currentUserReactionType =
                post.user_reaction?.[0]?.reaction_type ?? null;

            return {
                id: post.id,
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
