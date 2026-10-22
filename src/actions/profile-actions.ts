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

    // Return error if user is not authenticated
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

    // Fetch existing profile to check for old avatar URL
    const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", profileId)
        .single();

    if (fetchError) {
        return {
            success: false,
            message: "Error: Cannot fetch existing profile",
        };
    }

    // Delete old avatar URL if user is changing theirs
    if (existingProfile.avatar_url && existingProfile.avatar_url !== avatarUrl) {
        // Extract relative path from the Supabase public URL string
        try {
            const urlParts = existingProfile.avatar_url.split("/avatars/");
            if (urlParts.length > 1) {
                const oldStoragePath = urlParts[1];

                await supabase.storage.from("avatars").remove([oldStoragePath]);
            }
        }
        catch (storageError) {
            console.error("Error:", storageError);
        }
    }

    // Update profile data with new values
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
            message: "Error: Failed to update profile in database.",
        };
    }

    // Revalidate profile page and refresh
    revalidatePath(`/profile/${profileId}`);

    return {
        success: true,
        message: "Success: Profile updated successfully",
    };
}
