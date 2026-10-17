"use client";

import { useState } from "react";
import EditProfileModal from "./edit-profile-modal";

export default function EditProfileModalWrapper() {
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
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
