# DECISIONS.md — Legnarapex Frontend

Registro de decisiones de arquitectura y diseño del proyecto.

---

## Stack

| Capa         | Tecnología                     | Razón                                              |
|--------------|--------------------------------|----------------------------------------------------|
| Frontend     | Next.js 16 + App Router        | SSR, rutas anidadas, layout protegido para /admin  |
| Estilos      | Tailwind CSS v4                | Tokens de marca en CSS puro, sin config JS         |
| Auth         | Supabase Auth                  | Sin costo adicional, integrado con la DB           |
| DB           | PostgreSQL via Supabase        | RLS nativo, SDK de cliente para Next.js            |
| Storage      | Cloudflare R2                  | Egress gratuito vs. S3/GCS                         |
| Backend      | Spring Boot (Java) en Railway  | Thumbnailator para marca de agua, cron integrado   |
| Deploy FE    | Vercel                         | Integración nativa con Next.js                     |

---

## Decisiones pendientes

- [ ] Dominio personalizado para Vercel
- [ ] URL pública de R2 (CDN o bucket público)
- [ ] Tipografía de marca (actualmente Arial de sistema)
- [ ] Fotos reales de muestra para la galería placeholder
