# Supabase — Legnarapex

## Ejecutar la migración inicial

1. Abre tu proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** → **New query**
3. Pega y ejecuta el contenido de `migrations/001_init.sql`

Eso crea las tablas, activa RLS, aplica las políticas y carga el seed (Pista Norte / Pista Sur).

## Variables de entorno necesarias

Copia `.env.local.example` a `.env.local` y rellena:

```
NEXT_PUBLIC_SUPABASE_URL     → Proyecto → Settings → API → Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY → Proyecto → Settings → API → anon public
SUPABASE_SERVICE_ROLE_KEY    → Proyecto → Settings → API → service_role (solo backend)
```

## Resumen de RLS

| Tabla    | anon (público)               | authenticated (admin)  |
|----------|------------------------------|------------------------|
| lugares  | SELECT donde activo = true   | INSERT / UPDATE / DELETE |
| fotos    | SELECT donde expira_en > now | INSERT / UPDATE / DELETE |

El backend Spring Boot usa la `SUPABASE_SERVICE_ROLE_KEY` (bypasea RLS) para insertar y eliminar fotos.
El frontend Next.js usa la `anon key` — solo puede leer lo que RLS permite.
