-- Function to increment event registrations count
create or replace function increment_event_registrations(event_id uuid)
returns void
language plpgsql
as $$
begin
  update public.events
  set registrations = registrations + 1
  where id = event_id;
end;
$$;

-- Function to decrement event registrations count
create or replace function decrement_event_registrations(event_id uuid)
returns void
language plpgsql
as $$
begin
  update public.events
  set registrations = greatest(0, registrations - 1)
  where id = event_id;
end;
$$;
