import z from "zod";

export interface ProfilePageProps {
    params: Promise<{
        "profile-id": string;
    }>;
    searchParams?: Promise<{
        page?: string;
        filter?: string;
        study?: string;
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

export interface CreatePostState {
    message?: string;
    success?: boolean;
    errors?: ReturnType<typeof z.treeifyError>;
}

export type EditPostState =  {
    message?: string;
    success?: boolean;
    errors?: ReturnType<typeof z.treeifyError>;
    content?: string;
    imageUrl?: string | null;
};

export interface DeletePostState {
    message?: string;
    success?: boolean;
}

export interface Post {
    id: string;
    content: string;
    image_url: string | null;
    user_id: string;
    author: {
        username: string;
        display_name: string;
        avatar_url: string | null;
        updated_at: string;
    };
    likes: number;
    dislikes: number;
    comments: number;
    currentUserReaction: string | null;
    hasLiked: boolean;
    hasDisliked: boolean;
}

export type reactionType = "like" | "dislike";