CREATE POLICY "Allow authenticated uploads to user folder" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));

CREATE POLICY "Allow owners to update and delete" ON "storage"."objects"
  FOR ALL
  TO "authenticated"
  USING (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));

CREATE POLICY "Give public read access" ON "storage"."objects"
  FOR SELECT
  TO "anon", "authenticated"
  USING ((bucket_id = 'avatars'::text));
