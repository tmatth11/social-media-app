import { CircleQuestionMark } from "lucide-react";

export default function ModeToggleSkeleton() {
    return (
        <button
            aria-label="Loading dark mode toggle"
            className="mode-toggle scale-0 rotate-90 cursor-pointer"
        >
            <CircleQuestionMark />
        </button>
    );
}