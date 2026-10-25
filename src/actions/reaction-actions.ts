"use server";

import { createClient } from "@/services/supabase/server";
import { reactionType } from "@/types";
import { revalidatePath } from "next/cache";

export async function toggleReaction(
    postId: string,
    currentUserReaction: string | null,
    reactionType: reactionType,
    authorId: string,
) {
    const supabase = await createClient();

    // Get currently user logged in user
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    // Return error if user is not authenticated
    if (error || !user) {
        console.error("Authentication Error:", error);
        return;
    }

    // Delete current user reaction if user has already reacted to post
    if (currentUserReaction) {
        const { error: deleteError } = await supabase
            .from("reactions")
            .delete()
            .eq("post_id", postId)
            .eq("user_id", user.id);

        if (deleteError) {
            console.error("Delete Error:", deleteError);
            return;
        }
    }

    // Add new reaction if user hasn't reacted or changes reaction type
    if (!currentUserReaction || currentUserReaction !== reactionType) {
        const { error: insertError } = await supabase.from("reactions").insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: reactionType,
        });

        if (insertError) {
            console.error("Insert Error:", insertError);
            return;
        }
    }

    // Revalidate necessary pages
    revalidatePath(`/post/${postId}`);
    revalidatePath(`/profile/${authorId}`);
    revalidatePath("/feed");
}
