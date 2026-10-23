"use server";

import { createClient } from "@/services/supabase/server";
import { CreatePostState, EditPostState, DeletePostState } from "@/types";
import { revalidatePath } from "next/cache";
import z from "zod";

const createPostSchema = z.object({
    content: z.string().min(1).max(280),
    imageUrl: z.preprocess(
        (val) => (val === "" ? null : val),
        z.string().nullable(),
    ),
});

export async function createPost(
    prevState: CreatePostState,
    formData: FormData,
): Promise<CreatePostState> {
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
        content: formData.get("content"),
        imageUrl: formData.get("image-url"),
    };

    // Validate fields
    const validatedFields = createPostSchema.safeParse(rawData);

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
    const { content, imageUrl } = validatedFields.data;

    // Insert into posts table
    const { data: postData, error: insertError } = await supabase
        .from("posts")
        .insert({
            user_id: user.id,
            content: content,
            image_url: imageUrl,
        })
        .select()
        .single();

    // Return error if insert operation has failed
    if (insertError || !postData) {
        console.error("Error:", insertError?.message || "No data returned");

        return {
            success: false,
            message: "Error: Failed to create post in database.",
        };
    }

    // Revalidate necessary pages
    revalidatePath(`/post/${postData.id}`);
    revalidatePath(`/profile/${user.id}`);
    revalidatePath("/feed");

    return {
        success: true,
        message: "Success: Post created successfully.",
    };
}

export async function deletePost(
    prevState: DeletePostState,
    formData: FormData,
) {
    const supabase = await createClient();

    // Get currently user logged in user
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    // Return error if user is not authenticated
    if (authError || !user) {
        return {
            success: false,
            message: "Error: User is not authenticated.",
        };
    }

    const postId = formData.get("post-id") as string;
    const authorId = formData.get("author-id") as string;

    // Return error is user does not own post
    if (authorId !== user.id) {
        return {
            success: false,
            message: "Error: User does not own post.",
        };
    }

    // Return unsucessful if post was not found
    if (!postId) {
        return {
            success: false,
            message: "Error: Missing post ID.",
        };
    }

    // Fetch existing post to check for post image
    const { data: existingPost, error: fetchError } = await supabase
        .from("posts")
        .select("image_url")
        .eq("id", postId)
        .single();

    if (fetchError) {
        return {
            success: false,
            message: `Error: ${fetchError.message}`,
        };
    }

    if (!existingPost) {
        return {
            success: false,
            message: "Error: Cannot fetch existing post.",
        };
    }

    const { error } = await supabase.from("posts").delete().eq("id", postId);

    // Return unsucessful if error has occurred
    if (error) {
        return {
            success: false,
            message: `Error: ${error.message}`,
        };
    }

    // Delete post image from storage bucket if it exists
    if (existingPost.image_url) {
        // Extract relative path from the Supabase public URL string
        try {
            const urlParts = existingPost.image_url.split("/post_images/");
            if (urlParts.length > 1) {
                const oldStoragePath = urlParts[1];

                await supabase.storage
                    .from("post_images")
                    .remove([oldStoragePath]);
            }
        } catch (storageError) {
            console.error("Error:", storageError);
        }
    }

    return {
        success: true,
        message: "",
    };
}

const editPostSchema = z.object({
    postId: z.string().min(1),
    authorId: z.string().min(1),
    content: z.string().min(1).max(280),
    imageUrl: z.preprocess(
        (val) => (val === "" ? null : val),
        z.string().nullable(),
    ),
});

export async function editPost(
    prevState: EditPostState,
    formData: FormData,
): Promise<EditPostState> {
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
        content: formData.get("content"),
        imageUrl: formData.get("image-url"),
        postId: formData.get("post-id"),
        authorId: formData.get("author-id"),
    };

    // Validate fields
    const validatedFields = editPostSchema.safeParse(rawData);

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
    const { content, imageUrl, postId, authorId } = validatedFields.data;

    // Return error is user does not own post
    if (authorId !== user.id) {
        return {
            success: false,
            message: "Error: User does not own post.",
        };
    }

    // Fetch existing post to check for old avatar URL
    const { data: existingPost, error: fetchError } = await supabase
        .from("posts")
        .select("image_url")
        .eq("id", postId)
        .single();

    if (fetchError) {
        return {
            success: false,
            message: "Error: Cannot fetch existing post.",
        };
    }

    // Delete old avatar URL if user is changing theirs
    if (
        existingPost.image_url &&
        existingPost.image_url !== imageUrl
    ) {
        // Extract relative path from the Supabase public URL string
        try {
            const urlParts = existingPost.image_url.split("/post_images/");
            if (urlParts.length > 1) {
                const oldStoragePath = urlParts[1];

                await supabase.storage.from("post_images").remove([oldStoragePath]);
            }
        } catch (storageError) {
            console.error("Error:", storageError);
        }
    }

    // Update post data with new values
    const { error: updateError } = await supabase
        .from("posts")
        .update({
            content: content,
            image_url: imageUrl,
        })
        .eq("id", postId);

    // Return error if update operation has failed
    if (updateError) {
        console.error("Error:", updateError.message);

        return {
            success: false,
            message: "Error: Failed to update profile in database.",
        };
    }

    console.log("content =", content);
    console.log("imageUrl =", imageUrl);

    return {
        success: true,
        content: content,
        imageUrl: imageUrl,
    };
}
