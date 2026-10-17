// Source: https://supabase.com/docs/guides/getting-started/tutorials/with-react?queryGroups=database-method&database-method=sql#update-the-account-component

"use client";

import { editProfile } from "@/actions/profile-actions";
import { EditProfileState, Profile } from "@/types";
import { useActionState, useState } from "react";

const initialState: EditProfileState = {};

export default function EditProfileForm({ profile }: { profile: Profile }) {
    const [displayName, setDisplayName] = useState(profile.display_name);
    const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
    const [isLoading, setIsLoading] = useState(false);

    const [state, formAction, isPending] = useActionState<
        EditProfileState,
        FormData
    >(editProfile, initialState);

    return (
        <form className="mt-4 flex flex-col">
            <input type="hidden" name="profile-id" value={profile.id} />
            <input type="hidden" name="avatar-url" value={avatarUrl || ""} />
            <p className="mb-4">AvatarUpload placeholder</p>
            <div className="form-group">
                {/* Display name input */}
                <label className="form-group">
                    <span className="form-label">Display Name</span>
                    <input
                        className="form-input"
                        id="display-name"
                        name="display-name"
                        type="text"
                        placeholder="Enter display name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div className="my-4 flex items-center justify-center">
                {state?.message && <p className="form-error">{state?.message}</p>}
            </div>
            <button
                className="btn btn-primary mt-4"
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? "Loading..." : "Edit"}
            </button>
        </form>
    );
}
