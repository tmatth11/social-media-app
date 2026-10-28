import { getProfiles } from "@/utils/queries/profiles";
import ProfileCard from "./profile-card";

export default async function CommentList({
    query,
    currentPage,
}: {
    query?: string;
    currentPage: number;
}) {
    const { data: profiles, error: profilesError } = await getProfiles(
        currentPage,
        query,
    );

    if (profilesError || !profiles) {
        return (
            <p className="form-error text-center">
                An error has occured fetching profiles.
            </p>
        );
    }

    if (profiles.length === 0) {
        return <p className="text-center">There are no profiles to display.</p>;
    }

    return (
        <div className="bg-container-primary flex w-full flex-col divide-y rounded-md">
            {profiles.map((profile) => (
                <ProfileCard
                    key={profile.id}
                    profile={profile}
                />
            ))}
        </div>
    );
}
