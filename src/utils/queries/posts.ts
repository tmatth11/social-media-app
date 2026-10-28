"use server";

import { createClient } from "@/services/supabase/server";
import { Post } from "@/types";

const ITEMS_PER_PAGE = 10;

export async function getPostsPages(profileId?: string) {
    const supabase = await createClient();

    // Get number of posts
    let query = supabase
        .from("posts")
        .select("*", { count: "exact", head: true });

    // Filter the user ID if provided
    if (profileId) {
        query = query.eq("user_id", profileId);
    }

    const { count: postCount, error: countError } = await query;

    if (countError || postCount === null) {
        return {
            success: false,
            data: null,
        };
    }

    return {
        success: true,
        data: Math.ceil(postCount / ITEMS_PER_PAGE),
    };
}

export const getPosts = async (currentPage: number, profileId?: string) => {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;

    const page = Math.max(1, currentPage || 1);

    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

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

export const getPost = async (postId: string) => {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;

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
        .eq("dislikes.reaction_type", "dislike")
        .eq("id", postId);

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

    const { data: post, error } = await query.single();

    if (error) {
        console.error("Error:", error);

        return { data: null, error };
    }

    const currentUserReactionType =
        post.user_reaction?.[0]?.reaction_type ?? null;

    const formattedPost = {
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

    return { data: formattedPost, error: null };
};

export async function getPostIds() {
    const supabase = await createClient();

    const { data } = await supabase
        .from("posts")
        .select("id");
    
    return data || [];
}