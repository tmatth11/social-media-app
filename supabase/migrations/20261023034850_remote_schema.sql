ALTER TABLE "public"."posts"
  DROP COLUMN "title";

ALTER TABLE "public"."posts"
  ADD CONSTRAINT "posts_content_check" CHECK (((length(content) >= 1) AND (length(content) <= 280)));

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE POLICY "Authenticated users can update their own posts" ON "public"."posts"
  FOR UPDATE
  TO "authenticated"
  USING ((auth.uid() = user_id));

