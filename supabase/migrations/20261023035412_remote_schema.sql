DROP TRIGGER "handle_comments_updated_at" ON "public"."comments";

DROP TRIGGER "handle_updated_at" ON "public"."comments";

DROP TRIGGER "handle_posts_updated_at" ON "public"."posts";

DROP TRIGGER "handle_updated_at" ON "public"."posts";

CREATE TRIGGER handle_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime('updated_at');

