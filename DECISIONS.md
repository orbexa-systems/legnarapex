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

## [2026-08-13] Watermark SOLO en el uploader Python — riesgo explícito y aceptado

**Contexto:** Auditoría de performance (2026-08-13) confirmó que `WatermarkService.java` no está inyectado en `FotoService.java`. El backend sube cualquier JPG que reciba sin validar ni aplicar watermark. El procesamiento completo (CR3 → JPG → watermark diagonal 45°) ocurre exclusivamente en el uploader Python antes de enviar al backend.

**Decisión:** Se mantiene esta arquitectura de forma intencional. El cliente (Legnarapex) entrega las fotos únicamente a través del uploader Python. No existe ni se planea en corto plazo un flujo alternativo de subida (web, móvil, etc.).

**Riesgo documentado y aceptado:** Si alguien sube una foto directamente al endpoint `POST /fotos/upload` sin pasar por el uploader Python (por ejemplo con curl, Postman o cualquier cliente HTTP), la foto se almacenará y mostrará **sin marca de agua**. El backend no tiene forma de detectarlo ni rechazarlo porque no tiene información sobre el origen.

**Mitigación adoptada:** Documentar explícitamente este comportamiento. Si en el futuro se habilita subida desde otro canal, se debe re-activar `WatermarkService` en `FotoService` o añadir una validación de origen (header secreto, firma, etc.) antes de aceptar el upload.

**Archivos afectados:** `WatermarkService.java` (código presente pero inactivo), `FotoService.java` (no inyecta WatermarkService).

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

---

## [2026-08-13] Estrategia de servicio de imágenes — migración a next/image

**Contexto:** Auditoría de performance detectó que `PhotoCard` y `Lightbox` usan `<img>` nativo apuntando directamente a las URLs de R2 (2400px JPEG). Un grid de 20 fotos descarga 16–40 MB solo para mostrar thumbnails de ~300px. En móvil sin wifi, eso equivale a 30–90 segundos de carga visible.

**Decisión:** Migrar a `next/image` para aprovechar Vercel Image Optimization (resize automático al tamaño del elemento, conversión WebP/AVIF, srcset). Esto requiere también implementar el proxy `/api/foto/[codigo]` para dejar de exponer URLs directas de R2.

**Impacto esperado:** Reducción de payload en grid ~85–95% (de ~1.5 MB por imagen a ~20–40 KB WebP en thumbnail). Cache-Control `immutable` en R2 para segunda visita desde cache local (<5ms).

**Alternativas consideradas:** Generar thumbnails separados al subir (más control pero más complejidad de storage), usar Cloudflare Image Resizing (requiere plan Cloudflare Pro).

---

## Decisiones pendientes

**Críticas — bloquean producción real:**
- [ ] `FotoService.java`: cambiar `EXPIRY_DAYS = 1` → `8` antes de lanzar
- [ ] `FotoCleanupScheduler.java`: cron ajustar a 2 AM México (8:00 UTC)
- [ ] Middleware de auth (`middleware.ts`) — `/admin/*` sin protección edge actualmente

**Alta prioridad — performance y seguridad:**
- [ ] Proxy de imágenes `/api/foto/[codigo]` — URLs R2 expuestas en HTML del cliente
- [ ] Migrar `<img>` → `next/image` en `PhotoCard` y `Lightbox`
- [ ] Cache-Control `immutable` en `R2StorageService.upload()` — sin headers hoy
- [ ] Fixes de memoria en `uploader.py` (ver `WORK_PLAN.md`)

**Media prioridad:**
- [ ] Staging environment en Railway trackeando `develop`
- [ ] Compresión Brotli/Gzip en Spring Boot (`server.compression.enabled=true`)

**Baja prioridad:**
- [ ] Dominio personalizado para Vercel
- [ ] Empaquetar uploader como `.exe` con PyInstaller (espera logo `.ico`)
- [ ] Validación de origen en `POST /fotos/upload` si se habilita otro canal de subida
