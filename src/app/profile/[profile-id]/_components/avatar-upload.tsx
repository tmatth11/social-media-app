// Source: https://supabase.com/docs/guides/getting-started/tutorials/with-react?queryGroups=database-method&database-method=sql#create-an-upload-widget
"use client";

import { createClient } from "@/services/supabase/client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function AvatarUpload({
    profileId,
    url,
    onUpload,
}: {
    profileId: string;
    url: string | null;
    onUpload: (event: React.ChangeEvent<HTMLInputElement>, url: string) => void;
}) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const supabase = createClient();

    async function downloadImage(path: string) {
        try {
            const { data, error } = await supabase.storage
                .from("avatars")
                .download(path);
            if (error) {
                throw error;
            }

            const url = URL.createObjectURL(data);
            setAvatarUrl(url);
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unknown database error occurred";

            console.error("Error downloading image:", errorMessage);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (url) downloadImage(url);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("Error: Image must be selected.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const fileName = `${profileId}.${fileExt}`;
            const filePath = `${profileId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                throw uploadError;
            }

            setAvatarUrl(URL.createObjectURL(file));
            onUpload(event, filePath);
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unknown database error occurred";

            console.error("Error uploading image:", errorMessage);
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="flex flex-col items-center">
            <p className="font-semibold">Profile Picture</p>
            <Image
                className="rounded-full my-2"
                src={avatarUrl ? avatarUrl : "/blank-user.png"}
                alt="User avatar"
                width="100"
                height="100"
            />
            <button
                type="button"
                className="btn btn-primary w-50"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
            >
                {uploading ? "Uploading..." : "Upload Avatar"}
            </button>

            <input
                ref={fileInputRef}
                type="file"
                id="single"
                accept="image/*"
                onChange={uploadAvatar}
                disabled={uploading}
                className="hidden"
            />
        </div>
    );
}
