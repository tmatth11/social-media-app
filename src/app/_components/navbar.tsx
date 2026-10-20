"use client";

import Link from "next/link";
import ModeToggle from "./mode-toggle";
import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/services/supabase/client";
import { useRouter } from "next/navigation";
import {
    CircleArrowRight,
    CircleArrowUp,
    LogOut,
    Menu,
    Newspaper,
    User,
    UsersRound,
    X,
} from "lucide-react";

export default function Navbar() {
    const [isLinksOpen, setIsLinksOpen] = useState(false);
    const { user, isAuthenticated } = useUser();
    const supabase = createClient();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <header className="bg-navbar sticky top-0 left-0 w-full">
            {/* Top navbar */}
            <nav className="flex items-center justify-between px-2 py-4">
                {/* Home page link */}
                <Link
                    href="/"
                    className="hover:text-link-hover cursor-pointer text-2xl font-semibold"
                    onClick={() => setIsLinksOpen(false)}
                >
                    Social Media App
                </Link>
                <div className="flex items-center gap-4">
                    {/* Feed page link */}
                    <Link className="hidden md:flex" href="/feed">
                        <div className="nav-link">
                            <Newspaper />
                            <span>Feed</span>
                        </div>
                    </Link>
                    {/* Profiles page link */}
                    <Link className="hidden md:flex" href="/profiles">
                        <div className="nav-link">
                            <UsersRound />
                            <span>Profiles</span>
                        </div>
                    </Link>
                    {user && (
                        <>
                            {/* Profile page link */}
                            <Link
                                className="hidden md:flex"
                                href={`/profile/${user.id}`}
                            >
                                <div className="nav-link">
                                    <User />
                                    <span>Profile</span>
                                </div>
                            </Link>
                            {/* Log out button */}
                            <button
                                className="hidden md:flex cursor-pointer"
                                onClick={handleSignOut}
                            >
                                <div className="nav-link">
                                    <LogOut />
                                    <span>Log Out</span>
                                </div>
                            </button>
                        </>
                    )}
                    {!isAuthenticated && (
                        <>
                            {/* Log in link */}
                            <Link className="hidden md:flex" href="/auth/login">
                                <div className="nav-link">
                                    <CircleArrowRight />
                                    <span>Log in</span>
                                </div>
                            </Link>
                            {/* Sign up link */}
                            <Link
                                className="hidden md:flex"
                                href="/auth/sign-up"
                            >
                                <div className="nav-link">
                                    <CircleArrowUp />
                                    <span>Sign up</span>
                                </div>
                            </Link>
                        </>
                    )}
                    {/* Dark mode toggle */}
                    <div className="nav-link">
                        <ModeToggle />
                    </div>
                    {/* Hamburger menu/close button */}
                    <button
                        className="hover:text-link-hover flex cursor-pointer md:hidden"
                        aria-label={isLinksOpen ? "Close menu" : "Expand menu"}
                        title={isLinksOpen ? "Close menu" : "Expand menu"}
                        onClick={() => setIsLinksOpen(!isLinksOpen)}
                    >
                        {isLinksOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>
            {/* Bottom navbar */}
            <nav
                className={`${isLinksOpen ? "flex" : "hidden"} flex-col gap-4 p-4 md:hidden`}
            >
                <Link href="/feed" onClick={() => setIsLinksOpen(false)}>
                    <div className="nav-link">
                        <Newspaper />
                        <span>Feed</span>
                    </div>
                </Link>
                {/* Profiles page link */}
                <Link
                    href="/profiles"
                    onClick={() => setIsLinksOpen(false)}
                >
                    <div className="nav-link">
                        <UsersRound />
                        <span>Profiles</span>
                    </div>
                </Link>
                {user && (
                    <>
                        {/* Profile page link */}
                        <Link
                            href={`/profile/${user.id}`}
                            onClick={() => setIsLinksOpen(false)}
                        >
                            <div className="nav-link">
                                <User />
                                <span>Profile</span>
                            </div>
                        </Link>
                        {/* Log out button */}
                        <button
                            className="cursor-pointer"
                            onClick={() => {
                                handleSignOut();
                                setIsLinksOpen(false);
                            }}
                        >
                            <div className="nav-link">
                                <LogOut />
                                <span>Log Out</span>
                            </div>
                        </button>
                    </>
                )}
                {!isAuthenticated && (
                    <>
                        {/* Log in link */}
                        <Link
                            href="/auth/login"
                            onClick={() => setIsLinksOpen(false)}
                        >
                            <div className="nav-link">
                                <CircleArrowRight />
                                <span>Log in</span>
                            </div>
                        </Link>
                        {/* Sign up link */}
                        <Link
                            href="/auth/sign-up"
                            onClick={() => setIsLinksOpen(false)}
                        >
                            <div className="nav-link">
                                <CircleArrowUp />
                                <span>Sign up</span>
                            </div>
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}
