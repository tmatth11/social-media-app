"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export interface PaginationProps {
    totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const validTotalPages = Math.max(1, totalPages);

    const rawPage = Number(searchParams.get("page")) || 1;
    const currentPage = Math.min(rawPage, validTotalPages);

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);

        if (pageNumber == validTotalPages + 1) {
            params.set("page", "1");
        } else if (pageNumber == 0) {
            params.set("page", validTotalPages.toString());
        } else {
            params.set("page", pageNumber.toString());
        }
        return `${pathname}?${params.toString()}`;
    };

    return (
        <div className="mt-4 flex items-center justify-center gap-3 p-2">
            {/* Previous arrow */}
            <Link href={createPageURL(currentPage - 1)}>
                <button
                    className="btn btn-primary"
                    aria-label="Previous page"
                    disabled={validTotalPages === 1}
                    tabIndex={-1}
                    title="Previous page"
                >
                    <ArrowLeft />
                    <span className="sr-only">
                        Previous page{" "}
                        {validTotalPages === 1
                            ? "(Disabled: There is only 1 page)"
                            : ""}
                    </span>
                </button>
            </Link>
            {/* Current page/Total pages */}
            <p>
                {currentPage} of {validTotalPages}
            </p>
            {/* Next arrow */}
            <Link href={createPageURL(currentPage + 1)}>
                <button
                    className="btn btn-primary"
                    aria-label="Next page"
                    disabled={validTotalPages === 1}
                    tabIndex={-1}
                    title="Next page"
                >
                    <ArrowRight />
                    <span className="sr-only">
                        Previous page{" "}
                        {validTotalPages === 1
                            ? "(Disabled: There is only 1 page)"
                            : ""}
                    </span>
                </button>
            </Link>
        </div>
    );
}
