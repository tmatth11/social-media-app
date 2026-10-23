import { createClient } from "@/services/supabase/server";
import Feed from "../_components/feed";
import { connection } from "next/server";

export const instant = false;

export default async function FeedPage(props: {
    searchParams?: Promise<{
        page?: string;
    }>;
}) {
    await connection();

    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;

    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    let canPost = false;

    if (user && !error) {
        canPost = true;
    }

    return (
        <div className="flex flex-col items-center overflow-x-hidden">
            <div className="mt-4 flex flex-col items-center md:w-3xl">
                <Feed canPost={canPost} currentPage={currentPage} />
            </div>
        </div>
    );
}
