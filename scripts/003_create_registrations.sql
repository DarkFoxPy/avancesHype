-- Create registrations table
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  user_name text not null,
  user_email text not null,
  phone text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  time_slot text,
  custom_answers jsonb default '{}'::jsonb,
  qr_code text,
  registered_at timestamptz default now()
);

-- Enable RLS
alter table public.registrations enable row level security;

-- Policies for registrations
create policy "registrations_select_own"
  on public.registrations for select
  using (
    user_id = auth.uid() or 
    exists (
      select 1 from public.events 
      where events.id = registrations.event_id 
      and events.organizer_id = auth.uid()
    )
  );

create policy "registrations_insert_authenticated"
  on public.registrations for insert
  with check (auth.uid() is not null);

create policy "registrations_update_organizer"
  on public.registrations for update
  using (
    exists (
      select 1 from public.events 
      where events.id = registrations.event_id 
      and events.organizer_id = auth.uid()
    )
  );

create policy "registrations_delete_own"
  on public.registrations for delete
  using (
    user_id = auth.uid() or 
    exists (
      select 1 from public.events 
      where events.id = registrations.event_id 
      and events.organizer_id = auth.uid()
    )
  );

-- Create indexes
create index if not exists registrations_event_idx on public.registrations(event_id);
create index if not exists registrations_user_idx on public.registrations(user_id);
