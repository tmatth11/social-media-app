import { createClient } from "@/services/supabase/server";

export async function getProfile(profileId: string) {
    const supabase = await createClient();

    // Get profile based on provided profile ID
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("username, display_name, avatar_url")
        .eq("id", profileId)
        .single();

    // Return error if error has occured
    if (error) {
        console.error("Error:", error);

        return { data: null, error };
    }

    // Return null if no profile has been found
    if (profile == null) {
        const errorMessage = "Error: No profile has been found.";
        console.error(errorMessage);

        return { data: null, error: errorMessage };
    }

    return { data: profile, error: null };
}
