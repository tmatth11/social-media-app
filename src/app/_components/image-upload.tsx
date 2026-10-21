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
    onUpload: (event: React.ChangeEvent<HTMLInputElement>, url: string) => void;
}) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // References the file input element
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initializes supabase client exactly once
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        let objectUrl: string | null = null;
        let cancelled = false;

        // Download image from post_image bucket and set image URL
        async function downloadImage(path: string) {
            try {
                const { data, error } = await supabase.storage
                    .from("post_images")
                    .download(path);

                if (error) {
                    throw error;
                }

                objectUrl = URL.createObjectURL(data);

                if (cancelled) {
                    URL.revokeObjectURL(objectUrl);
                    return;
                }

                setImageUrl(objectUrl);
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "An unknown database error occurred";

                if (!cancelled) {
                    console.error("Error downloading image:", errorMessage);
                }
            }
        }

        if (url) {
            void downloadImage(url);
        }

        return () => {
            cancelled = true;

            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [url, supabase]);

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

            setImageUrl(URL.createObjectURL(file));
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
        <div className="flex flex-col items-center mt-4">
            <p className="font-semibold">Post image</p>
            <Image
                className="my-2"
                src={imageUrl ? imageUrl : "/blank-image.png"}
                alt="Post image"
                width={300}
                height={400}
                unoptimized={imageUrl?.startsWith("blob:")}
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