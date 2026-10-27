"use server";

import { createClient } from "@/services/supabase/server";
import { CreateCommentState, EditCommentState } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

const createCommentSchema = z.object({
    comment: z.string().min(1).max(280),
    postId: z.string().min(1),
});

export async function createComment(
    prevState: CreateCommentState,
    formData: FormData,
): Promise<CreateCommentState> {
    const supabase = await createClient();

    // Get currently user logged in user
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    // Return error if user is not authenticated
    if (error || !user) {
        return {
            success: false,
            message: "Error: User is not authenticated.",
        };
    }

    // Get form elements
    const rawData = {
        comment: formData.get("comment"),
        postId: formData.get("post-id"),
    };

    // Validate fields
    const validatedFields = createCommentSchema.safeParse(rawData);

    // Return error if any fields are invalid
    if (!validatedFields.success) {
        return {
            errors: z.treeifyError(validatedFields.error),
            message:
                "Error: Missing or invalid fields. Please check your inputs.",
            success: false,
        };
    }

    // Extract validated form data
    const { comment, postId } = validatedFields.data;

    // Insert into comments table
    const { data: commentData, error: insertError } = await supabase
        .from("comments")
        .insert({
            user_id: user.id,
            post_id: postId,
            content: comment,
        })
        .select()
        .single();

    // Return error if insert operation has failed
    if (insertError || !commentData) {
        console.error("Error:", insertError?.message || "No data returned");

        return {
            success: false,
            message: "Error: Failed to create comment in database.",
        };
    }

    // Revalidate necessary pages
    revalidatePath(`/post/${postId}`);
    redirect(`/post/${postId}`);
}

const editCommentSchema = z.object({
    commentId: z.string().min(1),
    postId: z.string().min(1),
    authorId: z.string().min(1),
    content: z.string().min(1).max(280),
});

export async function editComment(
    prevState: EditCommentState,
    formData: FormData,
): Promise<EditCommentState> {
    const supabase = await createClient();

    // Get currently user logged in user
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    // Return error if user is not authenticated
    if (error || !user) {
        return {
            success: false,
            message: "Error: User is not authenticated.",
        };
    }

    // Get form elements
    const rawData = {
        commentId: formData.get("comment-id"),
        authorId: formData.get("author-id"),
        postId: formData.get("post-id"),
        content: formData.get("content"),
    };

    // Validate fields
    const validatedFields = editCommentSchema.safeParse(rawData);

    // Return error if any fields are invalid
    if (!validatedFields.success) {
        return {
            errors: z.treeifyError(validatedFields.error),
            message:
                "Error: Missing or invalid fields. Please check your inputs.",
            success: false,
        };
    }

    // Extract validated form data
    const { content, commentId, authorId, postId } = validatedFields.data;

    // Return error is user does not own comment
    if (authorId !== user.id) {
        return {
            success: false,
            message: "Error: User does not own comment.",
        };
    }

    // Update post data with new values
    const { error: updateError } = await supabase
        .from("comments")
        .update({
            content: content,
        })
        .eq("id", commentId);

    // Return error if update operation has failed
    if (updateError) {
        console.error("Error:", updateError.message);

        return {
            success: false,
            message: "Error: Failed to update comment in database.",
        };
    }

    // Revalidate necessary pages
    revalidatePath(`/post/${postId}`);

    return {
        success: true,
        message: ""
    };
}