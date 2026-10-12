"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@teispace/next-themes";
import ModeToggleSkeleton from "./mode-toggle-skeleton";

export default function ModeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Wait until mounted on client to safely show the UI
    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) {
        return <ModeToggleSkeleton />;
    }

    // resolvedTheme knows if the system is currently "light" or "dark"
    const isDark = resolvedTheme === "dark";

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark");
    };

    return (
        <button
            aria-label={isDark ? "Light mode" : "Dark mode"}
            onClick={toggleTheme}
            title="Toggle theme"
            className="cursor-pointer rounded-md border p-2 "
        >
            {isDark ? (
                <Sun className="mode-toggle scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            ) : (
                <Moon className="mode-toggle scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            )}
        </button>
    );
}
