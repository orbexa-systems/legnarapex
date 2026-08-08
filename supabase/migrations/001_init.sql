-- ============================================================
-- Legnarapex — Migración inicial
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- ─── Extensiones ─────────────────────────────────────────────
create extension if not exists "pgcrypto";


-- ─── Tabla: lugares ──────────────────────────────────────────
create table if not exists public.lugares (
  id         uuid        primary key default gen_random_uuid(),
  nombre     varchar     not null,
  activo     boolean     not null default true,
  created_at timestamptz not null default now()
);

alter table public.lugares enable row level security;

-- Lectura pública: solo lugares activos
create policy "lugares_lectura_publica"
  on public.lugares
  for select
  to anon, authenticated
  using (activo = true);

-- Escritura: solo usuarios autenticados (admin)
create policy "lugares_escritura_admin"
  on public.lugares
  for all
  to authenticated
  using (true)
  with check (true);


-- ─── Tabla: fotos ────────────────────────────────────────────
create table if not exists public.fotos (
  id          uuid        primary key default gen_random_uuid(),
  codigo      varchar     not null,
  lugar_id    uuid        not null references public.lugares(id) on delete restrict,
  fecha_foto  date        not null,
  hora_foto   time        not null,
  url_foto    text        not null,
  fecha_subida timestamptz not null default now(),
  expira_en   timestamptz not null
);

alter table public.fotos enable row level security;

-- Índices para búsqueda del cliente
create index if not exists fotos_codigo_idx    on public.fotos (codigo);
create index if not exists fotos_lugar_idx     on public.fotos (lugar_id);
create index if not exists fotos_fecha_idx     on public.fotos (fecha_foto);
create index if not exists fotos_expira_idx    on public.fotos (expira_en);

-- Lectura pública: solo fotos no expiradas
create policy "fotos_lectura_publica"
  on public.fotos
  for select
  to anon, authenticated
  using (expira_en > now());

-- Escritura: solo usuarios autenticados (admin / Spring Boot via service role)
create policy "fotos_escritura_admin"
  on public.fotos
  for all
  to authenticated
  using (true)
  with check (true);


-- ─── Seed: lugares iniciales ─────────────────────────────────
insert into public.lugares (nombre, activo) values
  ('Pista Norte', true),
  ('Pista Sur',   true)
on conflict do nothing;
