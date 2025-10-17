-- Create form_responses table for custom form submissions
create table if not exists form_responses (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  registration_id uuid references registrations(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  user_name text not null,
  user_email text not null,
  responses jsonb not null default '{}'::jsonb,
  submitted_at timestamp with time zone default now()
);

-- Create indexes
create index if not exists form_responses_event_idx on form_responses(event_id);
create index if not exists form_responses_registration_idx on form_responses(registration_id);

-- Enable RLS
alter table form_responses enable row level security;

-- Policies
create policy "Users can view their own form responses"
  on form_responses for select
  using (auth.uid() = user_id or auth.uid() in (
    select organizer_id from events where id = event_id
  ));

create policy "Authenticated users can submit form responses"
  on form_responses for insert
  with check (auth.uid() = user_id);

create policy "Event organizers can view all responses"
  on form_responses for select
  using (auth.uid() in (
    select organizer_id from events where id = event_id
  ));
