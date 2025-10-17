-- Create event visits tracking table
create table if not exists public.event_visits (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  visitor_ip text,
  visitor_user_agent text,
  user_id uuid references public.profiles(id) on delete set null,
  visited_at timestamptz default now()
);

-- Enable RLS
alter table public.event_visits enable row level security;

-- Policies for event visits
create policy "event_visits_insert_all"
  on public.event_visits for insert
  with check (true);

create policy "event_visits_select_organizer"
  on public.event_visits for select
  using (
    exists (
      select 1 from public.events 
      where events.id = event_visits.event_id 
      and events.organizer_id = auth.uid()
    )
  );

-- Create index for event lookups
create index if not exists event_visits_event_idx on public.event_visits(event_id);

-- Function to increment visit count
create or replace function increment_event_visits()
returns trigger
language plpgsql
as $$
begin
  update public.events
  set visit_count = visit_count + 1
  where id = new.event_id;
  
  return new;
end;
$$;

drop trigger if exists on_event_visit on public.event_visits;

create trigger on_event_visit
  after insert on public.event_visits
  for each row
  execute function increment_event_visits();
