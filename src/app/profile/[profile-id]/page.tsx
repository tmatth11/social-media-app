import { ProfilePageProps } from "@/types";
import { notFound } from "next/navigation";
import z from "zod";
import { getProfile } from "@/utils/queries/profiles";
import { connection } from "next/server";

export const instant = false;

const IdParamSchema = z.coerce.string().pipe(z.uuid());

export default async function ProfilePage({ params }: ProfilePageProps) {
    await connection(); 
    
    const resolvedParams = await params;

    const result = IdParamSchema.safeParse(resolvedParams["profile-id"]);
    if (!result.success) {
        return notFound();
    }

    const profileId = result.data;


    return (
        <div className="flex flex-col p-4">

        </div>
    );
}
