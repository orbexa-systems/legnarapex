# DECISIONS.md — Legnarapex

Registro de decisiones de arquitectura y diseño del proyecto.

---

## Stack

| Capa | Tecnología | Razón |
|------|-----------|-------|
| Frontend | Next.js + App Router | SSR, rutas anidadas, layout protegido para /admin |
| Estilos | Tailwind CSS | Tokens de marca en CSS puro |
| Auth | Supabase Auth | Sin costo adicional, integrado con la DB |
| DB | PostgreSQL via Supabase | RLS nativo, SDK de cliente para Next.js |
| Storage | Cloudflare R2 | Egress gratuito vs. S3/GCS |
| Backend | Spring Boot (Java) en Railway | Cron integrado, EXIF extraction |
| Deploy FE | Vercel | Integración nativa con Next.js |
| Uploader | Python + Tkinter + rawpy | CR3 → JPG local, sin dependencia de browser |

---

## [2026-08-11] Watermark movida del servidor al cliente (uploader)

**Contexto:** El servidor aplicaba watermark (resize 2400px + rotación 45° + composición) por cada foto recibida. Con 8 workers subiendo en paralelo, Railway se quedaba sin memoria (~400MB heap) y respondía HTTP 500 esporádicos.

**Decisión:** Mover el procesamiento de watermark al uploader Python usando Pillow. El servidor ahora solo recibe el JPG ya watermarkeado y lo guarda en R2 + DB.

**Alternativas consideradas:** Reducir workers a 2 (impacta velocidad), aumentar heap Railway (costo), semáforo server-side (complejo).

**Impacto:** WatermarkService.java sigue en el repo pero ya no se llama en el upload. Si en el futuro se añade subida vía web (sin el uploader), se deberá re-activar o aplicar la watermark de otra forma.

---

## [2026-08-11] Calidad JPG reducida de 92% a 85%

**Contexto:** Cada foto pesaba ~8MB con calidad 92%. Con 8 workers en paralelo, el ancho de banda de subida era el cuello de botella.

**Decisión:** Reducir calidad a 85% → ~4-5MB por foto, tiempo de upload ~2x más rápido. Calidad 85% es el estándar de la industria para fotografía web y es imperceptible a ojo.

**Alternativas consideradas:** Mantener 92% y reducir workers (más lento), convertir a WebP (incompatible con algunos flujos de entrega).

---

## [2026-08-11] Subida paralela con ThreadPoolExecutor (8 workers por defecto)

**Contexto:** El uploader original era secuencial: convertir una foto, subirla, repetir. Con 200+ fotos por sesión el tiempo era prohibitivo.

**Decisión:** Usar `concurrent.futures.ThreadPoolExecutor` con 8 workers. Cada worker hace su propio ciclo convert→watermark→upload. El usuario puede ajustar el número desde un spinbox en la UI.

**Por qué 8:** Balance entre paralelismo de red y saturación de CPU en conversión rawpy. Laptops modernas con 8+ núcleos pueden sostenerlo sin degradación.

---

## [2026-08-11] Cron y expiración temporal para desarrollo

**Contexto:** Durante desarrollo se suben fotos de prueba frecuentemente y era tedioso borrarlas manualmente.

**Decisión:** Cambiar temporalmente `EXPIRY_DAYS = 1` y cron a 1:00 AM México (7:00 UTC). **Revertir antes del lanzamiento a producción:** `EXPIRY_DAYS = 8` y cron a 2:00 AM México (8:00 UTC).

---

## [2026-08-08] Supabase connection pooler para Railway

**Contexto:** Railway solo tiene IPv4. Supabase direct DB hostname resuelve a IPv6 → `Network is unreachable`.

**Decisión:** Usar el connection pooler de Supabase (`aws-0-ca-central-1.pooler.supabase.com:5432`) que sí tiene IPv4. Usuario: `postgres.{project-ref}`.

---

## [2026-08-08] JVM heap fijo en 400MB en Dockerfile

**Contexto:** Sin `-Xmx`, la JVM tomaba memoria ilimitada y Railway mataba el proceso con OOM al procesar imágenes grandes con Thumbnailator.

**Decisión:** `ENTRYPOINT ["java", "-Xmx400m", "-Djava.net.preferIPv4Stack=true", ...]`. 400MB es suficiente para Thumbnailator y deja margen al container de Railway.

---

## Decisiones pendientes

- [ ] Dominio personalizado para Vercel
- [ ] Middleware de auth (`middleware.ts`) para proteger `/admin/*` en el edge
- [ ] Proxy de imágenes `/api/foto/[codigo]` para ocultar URLs de R2
- [ ] Filtro de franja horaria en galería pública
- [ ] Staging environment en Railway trackeando `develop`
