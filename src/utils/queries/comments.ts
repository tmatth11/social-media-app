"use server";

import { createClient } from "@/services/supabase/server";
import { Comment } from "@/types";

const ITEMS_PER_PAGE = 10;

export async function getCommentsPages(postId: string) {
    const supabase = await createClient();

    const { count: postCount, error: countError } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);

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

export const getComments = async (currentPage: number, postId: string) => {
    const supabase = await createClient();

    const page = Math.max(1, currentPage || 1);
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error } = await supabase
        .from("comments")
        .select(
            `
            id,
            content,
            post_id,
            user_id,
            profiles:user_id (
                username,
                display_name,
                avatar_url,
                updated_at
            )
        `,
        )
        .eq("post_id", postId)
        .order("updated_at", {
            ascending: false,
        })
        .range(from, to);

    if (error) {
        console.error("Error:", error);

        return { data: [] as Comment[], error };
    }

    const formattedComments =
        data?.map((comment) => {
            return {
                id: comment.id,
                content: comment.content,
                post_id: comment.post_id,
                user_id: comment.user_id,
                author: comment.profiles,
            };
        }) ?? [];

    return { data: formattedComments, error: null };
};
