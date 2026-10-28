import { createClient } from "@/services/supabase/server";
import { FileImage, MessageSquare, ThumbsUp } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";

export const metadata: Metadata = {
    title: "Home",
    description: "Post about anything",
};

export const instant = false;

export default async function HomePage() {
    await connection();

    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    let canSignIn = true;

    if (!error && user) {
        canSignIn = false;
    }

    return (
        <div className="flex flex-col items-center p-2">
            <div className="w-full md:w-3xl">
                {/* Hero section */}
                <section className="mt-5 flex flex-col items-center gap-4 md:flex-row">
                    <div className="flex flex-col items-center gap-2 md:items-start">
                        <h1 className="text-center text-3xl font-semibold md:text-left">
                            Post about anything
                        </h1>
                        <p className="mt-2 text-center md:text-left">
                            Create social media posts for anybody to comment or
                            react to
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                            {canSignIn && (
                                <Link
                                    href="/auth/sign-up"
                                    className="btn btn-primary"
                                >
                                    Sign Up
                                </Link>
                            )}
                            <Link href="/feed" className="btn btn-secondary">
                                View Feed
                            </Link>
                        </div>
                    </div>
                    <Image
                        width="500"
                        height="100"
                        src="/hero-image.png"
                        fetchPriority="high"
                        priority
                        alt="Screenshot of flashcard set page"
                    />
                </section>
                {/* Features section */}
                <section className="mt-4 flex flex-col items-center gap-2">
                    <h2>Features</h2>
                    <div className="mt-2 flex flex-col gap-4 md:flex-row">
                        {/* Image attachments */}
                        <div className="feature">
                            <div className="feature-icon">
                                <FileImage>
                                    <title>File image icon</title>
                                </FileImage>
                            </div>
                            <h3 className="text-lg">Image Attachments</h3>
                            <p>Optinally attach an image to your post</p>
                        </div>
                        {/* Comments */}
                        <div className="feature">
                            <div className="feature-icon">
                                <MessageSquare>
                                    <title>Message square icon</title>
                                </MessageSquare>
                            </div>
                            <h3 className="text-lg">Comments</h3>
                            <p>Comment on posts you find interesting</p>
                        </div>
                        {/* Reactions */}
                        <div className="feature">
                            <div className="feature-icon">
                                <ThumbsUp>
                                    <title>Thumbs up icon</title>
                                </ThumbsUp>
                            </div>
                            <h3 className="text-lg">Reactions</h3>
                            <p>Like or dislike any post</p>
                        </div>
                    </div>
                </section>
                {/* Call to action section */}
                <section className="mt-4 flex flex-col items-center gap-4">
                    <h2>What are you waiting for?</h2>
                    <Link className="btn btn-primary" href={canSignIn ? "/auth/sign-up" : "/feed"}>
                        Try Now
                    </Link>
                </section>
            </div>
        </div>
    );
}
