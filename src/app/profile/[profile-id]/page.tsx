import { ProfilePageProps } from "@/types";
import { notFound } from "next/navigation";
import z from "zod";
import ProfileDetails from "./_components/profile-details";

export const instant = false;

const IdParamSchema = z.coerce.string().pipe(z.uuid());

export default async function ProfilePage({ params }: ProfilePageProps) {
    const resolvedParams = await params;

    const result = IdParamSchema.safeParse(resolvedParams["profile-id"]);
    if (!result.success) {
        return notFound();
    }

    const profileId = result.data;

    return (
        <div className="flex flex-col p-4">
            <ProfileDetails profileId={profileId} />
        </div>
    );
}
