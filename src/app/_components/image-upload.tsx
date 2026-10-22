// Source: https://supabase.com/docs/guides/getting-started/tutorials/with-react?queryGroups=database-method&database-method=sql#create-an-upload-widget
"use client";

import { createClient } from "@/services/supabase/client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

export default function ImageUpload({
    url,
    onUpload,
}: {
    url: string | null;
    onUpload: (filePath: string, publicUrl: string) => void;
}) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initializes supabase client exactly once
    const supabase = useMemo(() => createClient(), []);

    async function uploadPostImage(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("Error: Image must be selected.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();

            // Recommended by Supabase to upload to a new path every time
            const fileName = `${crypto.randomUUID()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("post_images")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from("post_images")
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
        <div className="flex flex-col items-center mt-4">
            <p className="font-semibold">Post image</p>
            <Image
                className="my-2"
                src={url ? url : "/blank-image.png"}
                alt="Post image"
                width={300}
                height={400}
                unoptimized={url?.startsWith("blob:")}
            />
            <button
                type="button"
                className="btn btn-primary w-50"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
            >
                {uploading ? "Uploading..." : "Upload Post Image"}
            </button>
            <input
                ref={fileInputRef}
                type="file"
                id="single"
                accept="image/*"
                onChange={uploadPostImage}
                disabled={uploading}
                className="hidden"
            />
        </div>
    );
}