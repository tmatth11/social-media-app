export interface ProfilePageProps {
    params: Promise<{
        "profile-id": string;
    }>;
}

export interface Profile {
    username: string;
    display_name: string;
    avatar_url: string | null;
}
