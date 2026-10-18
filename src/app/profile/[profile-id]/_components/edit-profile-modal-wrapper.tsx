"use client";

import { useState } from "react";
import EditProfileModal from "./edit-profile-modal";
import { Profile } from "@/types";

export default function EditProfileModalWrapper({
    profile,
}: {
    profile: Profile;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
            >
                Edit Profile
            </button>
            <EditProfileModal
                key={`${profile.id}-${isModalOpen}`}
                profile={profile}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
