import z from "zod";

export interface ProfilePageProps {
    params: Promise<{
        "profile-id": string;
    }>;
    searchParams?: Promise<{
        page?: string;
    }>;
}

export interface Profile {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
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

export type EditPostState = {
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
export type commentBox = "open";

export interface PostPageProps {
    params: Promise<{
        "post-id": string;
    }>;
    searchParams?: Promise<{
        "comment-box"?: commentBox;
        page?: string;
    }>;
}

export interface CreateCommentState {
    message?: string;
    success?: boolean;
    errors?: ReturnType<typeof z.treeifyError>;
}

export interface Comment {
    id: string;
    content: string;
    post_id: string;
    user_id: string;
    author: {
        username: string;
        display_name: string;
        avatar_url: string | null;
        updated_at: string;
    };
}

export type EditCommentState = {
    message?: string;
    success?: boolean;
    errors?: ReturnType<typeof z.treeifyError>;
};

export interface DeleteCommentState {
    message?: string;
    success?: boolean;
}

export interface ProfilesPageProps {
    searchParams: Promise<{
        page?: string;
        query?: string;
    }>;
}
