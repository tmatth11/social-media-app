import CreatePostModalWrapper from "./create-post-modal-wrapper";

export default function Feed({ canPost }: { canPost: boolean }) {
    return (
        <div className="flex flex-col w-full">
            {/* Feed header */}
            <div className="flex flex-col gap-2 items-center md:flex-row md:justify-between p-4">
                <h2>Feed</h2>
                {canPost &&
                    <CreatePostModalWrapper />
                }
            </div>
        </div>
    );
}
