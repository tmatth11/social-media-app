import { createClient } from "@/services/supabase/server";
import Feed from "../_components/feed";
import { connection } from "next/server";

export const instant = false;

export default async function FeedPage() {
    await connection();
    
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
        <div className="flex flex-col items-center">
            <div className="flex flex-col items-center md:w-3xl">
                <Feed canPost={canPost} />
            </div>
        </div>
    );
}
