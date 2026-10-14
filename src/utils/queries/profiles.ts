"use client";

import { createClient } from "@/services/supabase/client";

export async function getProfile(profileId: string) {
    const supabase = createClient();

    // Get profile based on provided profile ID
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("username, display_name, avatar_url")
        .eq("id", profileId)
        .single();
    
    // Throw error if error has occured
    if (error) {
        console.error("Error:", error);

        throw error;
    }

    // Return null if no profile has been found
    if (profile == null) {
        console.error("Error: No profile has been found.");
        
        return null;
    }

    return profile;
}
