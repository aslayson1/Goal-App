-- Create RLS policies for tasks table that handle both authenticated and demo users
alter table public.tasks enable row level security;

-- Drop existing policies if they exist (idempotent)
drop policy if exists "insert own tasks" on public.tasks;
drop policy if exists "select own tasks" on public.tasks;
drop policy if exists "update own tasks" on public.tasks;
drop policy if exists "delete own tasks" on public.tasks;

-- Create new policies that allow both authenticated users and demo users
create policy "insert own tasks" on public.tasks for insert with check (
  (auth.uid() = user_id) OR 
  (user_id = '8e13f687-5273-4e9b-989f-01f887680df0'::uuid)
);

create policy "select own tasks" on public.tasks for select using (
  (auth.uid() = user_id) OR 
  (user_id = '8e13f687-5273-4e9b-989f-01f887680df0'::uuid)
);

create policy "update own tasks" on public.tasks for update using (
  (auth.uid() = user_id) OR 
  (user_id = '8e13f687-5273-4e9b-989f-01f887680df0'::uuid)
);

create policy "delete own tasks" on public.tasks for delete using (
  (auth.uid() = user_id) OR 
  (user_id = '8e13f687-5273-4e9b-989f-01f887680df0'::uuid)
);
