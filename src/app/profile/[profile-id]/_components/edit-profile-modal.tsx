"use client";

import { X } from "lucide-react";
import {
    useActionState,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { EditProfileState, Profile } from "@/types";
import { editProfile } from "@/actions/profile-actions";
import AvatarUpload from "./avatar-upload";
import { createClient } from "@/services/supabase/client";

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
    const [avatarPath, setAvatarPath] = useState<string | null>(null);
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(
        profile.avatar_url,
    );

    const [state, formAction, isPending] = useActionState<
        EditProfileState,
        FormData
    >(editProfile, initialState);

    const supabase = useMemo(() => createClient(), []);

    const handleCancelAndClose = useCallback(async () => {
        if (avatarPath) {
            try {
                await supabase.storage.from("avatars").remove([avatarPath]);
            } catch (error) {
                console.error(
                    "Failed to delete orphaned image from storage:",
                    error,
                );
            }
        }

        onClose();
    }, [avatarPath, supabase, onClose]);

    useEffect(() => {
        if (state?.success) {
            onClose();
            window.location.reload();
        }
    }, [onClose, state?.success]);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleCancelAndClose();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, handleCancelAndClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/50 p-4">
            <div
                key={`${profile.id}-${isOpen}`}
                className="bg-container-primary flex h-fit w-full max-w-md flex-col overflow-y-auto rounded-lg p-4 shadow-xl"
            >
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleCancelAndClose}
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
                        value={avatarPreviewUrl || ""}
                    />
                    <AvatarUpload
                        key={`${profile.id}-${isOpen}`}
                        profileId={profile.id}
                        url={avatarPreviewUrl}
                        onUpload={(filePath, publicUrl) => {
                            setAvatarPath(filePath);
                            setAvatarPreviewUrl(publicUrl);
                        }}
                    />
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
                        className="btn btn-primary"
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
