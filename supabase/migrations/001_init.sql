-- ============================================================
-- Legnarapex — Migración inicial
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- ─── Extensiones ─────────────────────────────────────────────
create extension if not exists "pgcrypto";


-- ─── Tabla: locations ────────────────────────────────────────
create table if not exists public.locations (
  id         uuid        primary key default gen_random_uuid(),
  name       varchar     not null,
  active     boolean     not null default true,
  created_at timestamptz not null default now()
);

alter table public.locations enable row level security;

create policy "locations_public_read"
  on public.locations for select
  to anon, authenticated
  using (active = true);

create policy "locations_admin_write"
  on public.locations for all
  to authenticated
  using (true) with check (true);


-- ─── Tabla: photos ───────────────────────────────────────────
create table if not exists public.photos (
  id          uuid        primary key default gen_random_uuid(),
  code        varchar     not null,
  location_id uuid        not null references public.locations(id) on delete restrict,
  photo_date  date        not null,
  photo_time  time        not null,
  photo_url   text        not null,
  uploaded_at timestamptz not null default now(),
  expires_at  timestamptz not null
);

alter table public.photos enable row level security;

create index if not exists photos_code_idx      on public.photos (code);
create index if not exists photos_location_idx  on public.photos (location_id);
create index if not exists photos_date_idx      on public.photos (photo_date);
create index if not exists photos_expires_idx   on public.photos (expires_at);

create policy "photos_public_read"
  on public.photos for select
  to anon, authenticated
  using (expires_at > now());

create policy "photos_admin_write"
  on public.photos for all
  to authenticated
  using (true) with check (true);


-- ─── Grants explícitos para rol anon ─────────────────────────
grant select on public.locations to anon;
grant select on public.locations to authenticated;
grant select on public.photos to anon;
grant select on public.photos to authenticated;


-- ─── Seed: ubicaciones iniciales ─────────────────────────────
insert into public.locations (name, active) values
  ('Pista Norte', true),
  ('Pista Sur',   true)
on conflict do nothing;
