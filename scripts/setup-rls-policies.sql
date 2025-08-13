-- Create RLS policies for tasks table
alter table public.tasks enable row level security;

-- Drop existing policies if they exist (idempotent)
drop policy if exists "insert own tasks" on public.tasks;
drop policy if exists "select own tasks" on public.tasks;
drop policy if exists "update own tasks" on public.tasks;
drop policy if exists "delete own tasks" on public.tasks;

-- Create new policies
create policy "insert own tasks" on public.tasks for insert to authenticated with check (auth.uid() = user_id);
create policy "select own tasks" on public.tasks for select to authenticated using (auth.uid() = user_id);
create policy "update own tasks" on public.tasks for update to authenticated using (auth.uid() = user_id);
create policy "delete own tasks" on public.tasks for delete to authenticated using (auth.uid() = user_id);
