-- Create user_preferences table to store user settings
create table if not exists public.user_preferences (
  id uuid primary key references auth.users(id) on delete cascade,
  -- Added name field to store user's display name
  name text,
  theme text default 'system',
  week_start_day text default 'monday',
  timezone text default 'America/New_York',
  notifications boolean default true,
  dashboard_mode text default 'standard',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.user_preferences enable row level security;

-- Allow users to view their own preferences
create policy "user_preferences_select_own"
  on public.user_preferences for select
  using (auth.uid() = id);

-- Allow users to insert their own preferences
create policy "user_preferences_insert_own"
  on public.user_preferences for insert
  with check (auth.uid() = id);

-- Allow users to update their own preferences
create policy "user_preferences_update_own"
  on public.user_preferences for update
  using (auth.uid() = id);

-- Create trigger to auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_user_preferences_updated
  before update on public.user_preferences
  for each row
  execute function public.handle_updated_at();

-- Create trigger to auto-create preferences on user signup
create or replace function public.handle_new_user_preferences()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_preferences (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created_preferences
  after insert on auth.users
  for each row
  execute function public.handle_new_user_preferences();
