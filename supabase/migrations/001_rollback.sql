-- ============================================================
-- Legnarapex — Rollback migración 001
-- ⚠️  Solo usar en desarrollo. Elimina TODOS los datos.
-- ============================================================

drop table if exists public.fotos   cascade;
drop table if exists public.lugares cascade;
