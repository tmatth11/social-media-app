// Source: https://supabase.com/docs/guides/getting-started/tutorials/with-react?queryGroups=database-method&database-method=sql#create-an-upload-widget

export default function AvatarUpload({ url, onUpload }: {
    url: string;
    onUpload: (event: Event, url: string) => void
}) {
    

    return (
        <>
            <p>AvatarUpload works!</p>
        </>
    );
}
