import { ProfilesPageProps } from "@/types";
import Searchbox from "./_components/searchbox";
import { getProfilesPages } from "@/utils/queries/profiles";
import { connection } from "next/server";
import { Metadata } from "next";
import Pagination from "../_components/pagination";
import { Suspense } from "react";
import ProfileList from "./_components/profile-list";

export const metadata: Metadata = {
    title: "Profiles",
    description: "View all profiles",
};

export const instant = false;

export default async function ProfilesPage(props: ProfilesPageProps) {
    await connection();

    const searchParams = await props.searchParams;

    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;

    const { success, data: totalPages }  = await getProfilesPages(query);

    return (
        <div className="flex flex-col items-center p-2">
            <div className="flex w-full flex-col items-center gap-2 md:max-w-3xl">
                <h1>Profiles</h1>
                <Searchbox placeholder="Enter username or display name" />
                {!success || totalPages === null ? (
                    <p className="form-error text-center">
                        An error has occurred
                    </p>
                ) : (
                    <>
                        <Suspense
                            fallback={<p className="text-center">Loading...</p>}
                        >
                            <ProfileList
                                query={query}
                                currentPage={currentPage}
                            />
                        </Suspense>
                        <Pagination totalPages={totalPages} />
                    </>
                )}
            </div>
        </div>
    );
}
