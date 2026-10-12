import Link from "next/link";
import ModeToggle from "./mode-toggle";

export default function Navbar() {
    return (
        <header className="bg-navbar sticky top-0 left-0 w-full">
            {/* Top navbar */}
            <nav className="flex items-center justify-between px-2 py-4">
                <Link
                    href="/"
                    className="hover:text-link-hover cursor-pointer text-2xl font-semibold"
                >
                    Social Media App
                </Link>
                <div className="flex items-center gap-4">
                    {/* Dark mode toggle */}
                    <div className="nav-link">
                        <ModeToggle />
                    </div>
                </div>
            </nav>
        </header>
    );
}
