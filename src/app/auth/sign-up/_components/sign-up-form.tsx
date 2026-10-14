// Source: https://supabase.com/library/docs/nextjs/password-based-auth

"use client";

import { createClient } from "@/services/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleSignUp = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const supabase = createClient();
        setIsLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Error: Passwords do not match.");
            setIsLoading(false);

            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username,
                        display_name: displayName,
                    },
                },
            });

            if (error) {
                throw error;
            }

            if (!data.user) {
                throw new Error(
                    "Sign up completed, but no user data was returned",
                );
            }

            router.push(`/profile/${data.user.id}`);
        } catch (error: unknown) {
            setError(
                error instanceof Error ? error.message : "An error occurred",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-container-primary mt-2 flex max-w-md flex-col rounded-md p-4">
            {/* Header */}
            <div className="flex flex-col">
                <h4>Sign up</h4>
                <p>
                    Create an account using an email, username, display name,
                    and password.
                </p>
            </div>
            {/* Divider */}
            <hr className="mt-4 border-t" />
            {/* Sign Up Form */}
            <form onSubmit={handleSignUp} className="flex flex-col">
                {/* Email input */}
                <label className="form-group">
                    <span className="form-label">Email</span>
                    <input
                        className="form-input"
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                {/* Username input */}
                <label className="form-group">
                    <span className="form-label">Username</span>
                    <input
                        className="form-input"
                        id="username"
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                {/* Display name input */}
                <label className="form-group">
                    <span className="form-label">Display Name</span>
                    <input
                        className="form-input"
                        id="display-name"
                        type="text"
                        placeholder="Enter display name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                    />
                </label>
                {/* Password input */}
                <label className="form-group">
                    <span className="form-label">Password</span>
                    <input
                        className="form-input"
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {/* Confirm password input */}
                <label className="form-group">
                    <span className="form-label">Confirm Password</span>
                    <input
                        className="form-input"
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                {/* Error message */}
                <div className="my-4 flex items-center justify-center">
                    {error && <p className="form-error">{error}</p>}
                </div>
                {/* Submit button */}
                <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Creating account..." : "Sign up"}
                </button>
            </form>
        </div>
    );
}
