SET local check_function_bodies = off;

ALTER TABLE "public"."comments"
  ALTER COLUMN "content" SET DEFAULT 'length(content) >= 1 AND length(content) <= 280'::text;

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'username',
    new.raw_user_meta_data ->> 'display_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$function$;

