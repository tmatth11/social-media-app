export interface ProfilePageProps {
    params: Promise<{
        "profile-id": string;
    }>;
}

export interface Profile {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
}
