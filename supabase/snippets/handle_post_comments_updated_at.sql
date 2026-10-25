DROP TRIGGER IF EXISTS handle_posts_updated_at ON public.posts;

CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

CREATE TRIGGER handle_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE PROCEDURE extensions.moddatetime (updated_at);

DROP TRIGGER IF EXISTS handle_comments_updated_at ON public.comments;

CREATE TRIGGER handle_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE PROCEDURE extensions.moddatetime (updated_at);