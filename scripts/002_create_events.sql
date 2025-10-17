-- Create events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, -- URL-friendly name
  title text not null,
  description text not null,
  start_date timestamptz not null,
  end_date timestamptz not null,
  duration_days integer generated always as (
    extract(day from (end_date - start_date))::integer + 1
  ) stored,
  location text,
  event_type text not null check (event_type in ('presencial', 'virtual', 'no_definido')),
  event_link text, -- Google Maps for presencial, Meet/Zoom for virtual
  category text not null,
  capacity integer not null default 200,
  unlimited_capacity boolean default false,
  registrations integer default 0,
  is_public boolean default true,
  requires_approval boolean default false,
  organizer_id uuid not null references public.profiles(id) on delete cascade,
  
  -- Media
  cover_image text,
  gallery_images text[] default array[]::text[],
  videos text[] default array[]::text[],
  
  -- 3D Map Configuration (stored as JSONB)
  map_3d_config jsonb,
  map_json_file text, -- URL to uploaded JSON file
  
  -- Schedule/Cronograma
  schedule jsonb default '[]'::jsonb,
  schedule_json_file text, -- URL to uploaded schedule JSON
  
  -- Custom Form
  has_custom_form boolean default false,
  custom_form_fields jsonb default '[]'::jsonb,
  
  -- About section
  about_event text,
  
  -- Visit tracking
  visit_count integer default 0,
  
  status text not null default 'draft' check (status in ('draft', 'published', 'cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.events enable row level security;

-- Policies for events
create policy "events_select_public"
  on public.events for select
  using (is_public = true or organizer_id = auth.uid());

create policy "events_insert_own"
  on public.events for insert
  with check (auth.uid() = organizer_id);

create policy "events_update_own"
  on public.events for update
  using (auth.uid() = organizer_id);

create policy "events_delete_own"
  on public.events for delete
  using (auth.uid() = organizer_id);

-- Create index for slug lookups
create index if not exists events_slug_idx on public.events(slug);

-- Create index for organizer lookups
create index if not exists events_organizer_idx on public.events(organizer_id);

-- Function to generate slug from title
create or replace function generate_slug(title text)
returns text
language plpgsql
as $$
declare
  slug text;
  counter integer := 0;
  temp_slug text;
begin
  -- Convert to lowercase and replace spaces with hyphens
  slug := lower(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'));
  slug := regexp_replace(slug, '\s+', '-', 'g');
  
  -- Check if slug exists and add counter if needed
  temp_slug := slug;
  while exists(select 1 from public.events where events.slug = temp_slug) loop
    counter := counter + 1;
    temp_slug := slug || '-' || counter;
  end loop;
  
  return temp_slug;
end;
$$;
