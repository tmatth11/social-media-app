// Source: https://supabase.com/docs/guides/getting-started/tutorials/with-react?queryGroups=database-method&database-method=sql#create-an-upload-widget
"use client";

import { createClient } from "@/services/supabase/client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

export default function AvatarUpload({
    profileId,
    url,
    onUpload,
}: {
    profileId: string;
    url: string | null;
    onUpload: (filePath: string, publicUrl: string) => void;
}) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = useMemo(() => createClient(), []);

    async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("Error: Image must be selected.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();

            // Recommended by Supabase to upload to a new path every time
            const fileName = `${crypto.randomUUID()}.${fileExt}`;
            const filePath = `${profileId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);
            onUpload(filePath, data.publicUrl);
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
                className="my-2 h-25 rounded-full object-cover"
                src={url ? url : "/blank-user.png"}
                alt="User avatar"
                width={100}
                height={100}
                unoptimized={url?.startsWith("blob:")}
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
