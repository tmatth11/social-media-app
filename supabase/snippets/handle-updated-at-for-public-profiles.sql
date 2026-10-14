create trigger handle_updated_at
  before update on public.profiles
  for each row
  execute procedure moddatetime (updated_at);