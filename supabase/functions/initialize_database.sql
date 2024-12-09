-- Create the vehicles table if it doesn't exist
create table if not exists public.vehicles (
    id uuid default gen_random_uuid() primary key,
    make text not null,
    model text not null,
    year integer not null,
    price numeric not null,
    condition text not null check (condition in ('new', 'used', 'certified')),
    status text not null check (status in ('available', 'sold', 'pending')),
    description text,
    specifications jsonb default '{}'::jsonb,
    images text[] default array[]::text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.vehicles enable row level security;

-- Create policies
create policy "Anyone can view vehicles"
    on public.vehicles for select
    using (true);

create policy "Anyone can manage vehicles"
    on public.vehicles for all
    using (true);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql security definer;

create trigger set_updated_at
    before update on public.vehicles
    for each row
    execute function public.handle_updated_at();

-- Create initialization function
create or replace function public.initialize_vehicles_table()
returns void as $$
begin
    -- Function exists just to ensure table is created
    return;
end;
$$ language plpgsql security definer;