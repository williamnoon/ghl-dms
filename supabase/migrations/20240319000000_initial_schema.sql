-- Enable RLS
alter table auth.users enable row level security;

-- Create vehicles table
create table if not exists public.vehicles (
    id uuid default gen_random_uuid() primary key,
    make text not null,
    model text not null,
    year integer not null,
    price numeric not null,
    condition text not null,
    status text not null,
    description text,
    specifications jsonb default '{}'::jsonb,
    images text[] default array[]::text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on vehicles
alter table public.vehicles enable row level security;

-- Create RLS policies
create policy "Public can view available vehicles"
    on public.vehicles for select
    using (status = 'available');

create policy "Authenticated users can manage vehicles"
    on public.vehicles for all
    using (auth.role() = 'authenticated');

-- Create function to initialize vehicles table
create or replace function public.initialize_vehicles_table()
returns void
language plpgsql
security definer
as $$
begin
    -- Add any initial data if needed
end;
$$;

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$;

create trigger set_updated_at
    before update on public.vehicles
    for each row
    execute function public.handle_updated_at();