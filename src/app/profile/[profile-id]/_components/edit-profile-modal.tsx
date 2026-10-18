"use client";

import { X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { EditProfileState, Profile } from "@/types";
import { editProfile } from "@/actions/profile-actions";

const initialState: EditProfileState = {};

export default function EditProfileModal({
    profile,
    isOpen,
    onClose,
}: {
    profile: Profile;
    isOpen: boolean;
    onClose: () => void;
}) {
    const [displayName, setDisplayName] = useState(profile.display_name);
    const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);

    const [state, formAction, isPending] = useActionState<
        EditProfileState,
        FormData
    >(editProfile, initialState);

    useEffect(() => {
        if (state?.success) {
            onClose();
        }
    }, [onClose, state?.success]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/50 p-4">
            <div key={`${profile.id}-${isOpen}`} className="bg-container-primary flex h-fit w-full max-w-md flex-col rounded-lg p-4 shadow-xl">
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close edit profile modal"
                        title="Close edit profile modal"
                        className="red-icon"
                    >
                        <X />
                    </button>
                </div>
                <div className="border-b">
                    <h3>Edit Profile</h3>
                    <p>
                        Edit your Display Name and/or profile picture using the
                        form below.
                    </p>
                </div>
                <form action={formAction} className="mt-4 flex flex-col">
                    <input type="hidden" name="profile-id" value={profile.id} />
                    <input
                        type="hidden"
                        name="avatar-url"
                        value={avatarUrl || ""}
                    />
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
                        {!state?.success && (
                            <p className="form-error">{state?.message}</p>
                        )}
                    </div>
                    <button
                        className="btn btn-primary mt-4"
                        type="submit"
                        disabled={isPending || displayName.trim() === ""}
                    >
                        {isPending ? "Loading..." : "Edit"}
                    </button>
                </form>
            </div>
        </div>
    );
}
