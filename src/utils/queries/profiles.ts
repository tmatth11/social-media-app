"use server";

import { createClient } from "@/services/supabase/server";
import { Profile } from "@/types";
import { cache } from "react";

const ITEMS_PER_PAGE = 10;

export const getProfile = cache(async (profileId: string) => {
    const supabase = await createClient();

    // Get profile based on provided profile ID
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
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
});

export async function getProfilesPages(query?: string) {
    const supabase = await createClient();

    // Get number of profiles with a username or display name that matches the provided query
    const { count: profileCount, error: countError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`);

    if (countError || profileCount === null) {
        console.error("countError =", countError);
        return {
            success: false,
            data: null,
        };
    }

    return {
        success: true,
        data: Math.ceil(profileCount / ITEMS_PER_PAGE),
    };
}

export async function getProfiles(currentPage: number, query?: string) {
    const supabase = await createClient();

    const page = Math.max(1, currentPage || 1);
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(
            `
                id,
                username,
                display_name,
                avatar_url
        `,
        )
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .range(from, to);

    if (profilesError) {
        console.error("profilesError =", profilesError);

        return { data: [] as Profile[], profilesError };
    }

    return { data: profiles, error: null };
}
