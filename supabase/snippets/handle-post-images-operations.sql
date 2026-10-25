CREATE POLICY "Public access to view images" 
ON storage.objects 
FOR SELECT 
TO anon, authenticated 
USING (bucket_id = 'post_images');

CREATE POLICY "Authenticated users can upload post images"
ON storage.objects 
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'post_images'
);

CREATE POLICY "Users can update their own post images"
ON storage.objects 
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'post_images' AND (auth.uid())::text = owner_id
)
WITH CHECK (
    bucket_id = 'post_images' AND (auth.uid())::text = owner_id
);

CREATE POLICY "Users can delete their own post images"
ON storage.objects 
FOR DELETE
TO authenticated
USING (
    bucket_id = 'post_images' AND (auth.uid())::text = owner_id
);