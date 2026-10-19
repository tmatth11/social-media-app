"use server";

import { createClient } from "@/services/supabase/server";
import { EditProfileState } from "@/types";
import { revalidatePath } from "next/cache";
import z from "zod";

const editProfileSchema = z.object({
    profileId: z.string().min(1),
    avatarUrl: z.preprocess(
        (val) => (val === "" ? null : val),
        z.string().nullable(),
    ),
    displayName: z.string().min(1),
});

export async function editProfile(
    prevState: EditProfileState,
    formData: FormData,
): Promise<EditProfileState> {
    const supabase = await createClient();

    // Check if user is authenticated
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    // Return error if user is authenticated
    if (error || !user) {
        return {
            success: false,
            message: "Error: User is not authenticated.",
        };
    }

    // Get form elements
    const rawData = {
        profileId: formData.get("profile-id"),
        displayName: formData.get("display-name"),
        avatarUrl: formData.get("avatar-url"),
    };

    // Validate fields
    const validatedFields = editProfileSchema.safeParse(rawData);

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
    const { profileId, displayName, avatarUrl } = validatedFields.data;

    // Return error is user does not own profile
    if (profileId !== user.id) {
        return {
            success: false,
            message: "Error: User does not own profile.",
        };
    }

    // Update profile data
    const { error: updateError } = await supabase
        .from("profiles")
        .update({
            id: profileId,
            display_name: displayName,
            avatar_url: avatarUrl,
        })
        .eq("id", profileId);

    // Return error if update operation has failed
    if (updateError) {
        console.error("Error:", updateError.message);

        return {
            success: false,
            message: "Error: Failed to update profile in database."
        }
    }

    // Revalidate profile page
    revalidatePath(`/profile/${profileId}`);

    return {
        success: true,
        message: "Profile updated successfully"
    }
}
