import { PostPageProps } from "@/types";
import { getCachedPost } from "@/utils/helpers";
import { connection } from "next/server";

export const instant = false;

export async function generateMetadata({ params }: PostPageProps) {
    await connection();

    const { content, profiles } = await getCachedPost(params);

    const author = profiles.username;

    let pageTitle = content;
    const maxLength = 12;
    if (content.length > maxLength) {
        pageTitle = pageTitle.slice(0, 12) + "...";
    }

    return {
        title: pageTitle,
        description: `A post from ${author}`,
    };
}

export default async function PostPage() {
    await connection();

    return (
        <>
            <p>PostPage works!</p>
        </>
    );
}