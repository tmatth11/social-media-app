import { createClient } from "@/services/supabase/server";
import { CreatePostState } from "@/types";
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
        imageUrl: formData.get("imageUrl"),
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
            message: "Error: Failed to create post in database."
        }
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
