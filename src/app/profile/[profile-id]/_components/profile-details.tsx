"use client";

import { Profile } from "@/types";
import { getProfile } from "@/utils/queries/profiles";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfileDetails({ profileId }: { profileId: string }) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                setLoading(true);
                const data = await getProfile(profileId);
                
                setProfile(data);
            } 
            catch (err: unknown) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "An unexpected error occurred";
                setError(message);
            } 
            finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [profileId]);

    if (loading) {
        return <p>Loading profile details...</p>
    }

    if (error) {
        return <p>Error loading profile: {error}</p>
    }

    if (!profile) {
        return notFound();
    }

    return (
        <>
            <p>Username: {profile.username}</p>
        </>
    );
}
