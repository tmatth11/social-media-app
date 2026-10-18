import z from "zod";

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
    updated_at: string;
}

export interface EditProfileState {
    message?: string;
    success?: boolean;
    errors?: ReturnType<typeof z.treeifyError>;
}
