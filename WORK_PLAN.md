# WORK_PLAN.md — Legnarapex
## Auditoría de performance y memoria — Plan de ejecución

> Generado: 2026-08-13  
> Origen: auditoría técnica del stack completo (Python uploader + Java backend + Next.js frontend)

---

## Qué encontró la auditoría

### Problema 1: Riesgo de OOM en el uploader Python

El pipeline de conversión CR3 → JPG crea objetos de imagen que consumen hasta **120 MB por worker** simultáneamente, sin liberarlos explícitamente. Con 8 workers por defecto:

- El array numpy raw del CR3 (~60 MB) y la PIL Image derivada (~60 MB) coexisten en RAM antes de que el GC pueda actuar.
- Los objetos PIL intermedios del watermark (~80–100 MB adicionales por foto) tampoco se cierran explícitamente.
- Los `jpg_bytes` ya convertidos se acumulan en la cola del `ThreadPoolExecutor` de upload sin control de backpressure: con 500 fotos pendientes pueden acumularse varios GB.
- `BytesIO` y PIL Images no se cierran con `finally`, solo cuando el GC decide recogerlos.

**Riesgo real:** sesiones largas (500+ CR3) o máquinas con RAM limitada pueden llegar a OOM y corromper el checkpoint.

### Problema 2: Galería pública lenta (especialmente móvil)

El cuello de botella principal es uno solo: **las fotos se sirven a 2400px para cards de ~300px**.

- `PhotoCard` usa `<img src={photo.photo_url}>` apuntando directamente al JPEG de 2400px en R2.
- Un grid de 20 fotos = 16–40 MB de descarga para mostrar thumbnails de 200px.
- En 4G con latencia alta: 30–90 segundos de carga visible.
- No hay `Cache-Control` en los objetos de R2 → el browser re-descarga en cada visita.
- `next.config.ts` tiene `remotePatterns` de R2 configurado pero nunca se usa porque ambos componentes usan `<img>` nativo en vez de `next/image`, perdiendo la optimización automática de Vercel (WebP/AVIF + resize + srcset).
- Las URLs directas de R2 quedan expuestas en el HTML, lo cual viola la especificación de `CLAUDE.md` y permite descarga directa sin pasar por el proxy.

---

## Plan de ejecución — Uploader Python

> Rama: `fix/uploader-memory-leaks`  
> Base: `develop`  
> Archivo: `legnarapex-uploader/uploader.py`

### Tarea U-1 — Liberar numpy array inmediatamente después de crear PIL Image
**Prioridad:** CRÍTICA | **Esfuerzo:** 5 min  
**Impacto:** Reduce pico de RAM por worker de ~120 MB a ~60 MB.

```python
# En _convert_photo(), después de la línea:
rgb = raw.postprocess(use_camera_wb=True, no_auto_bright=False, output_bps=8)

img = Image.fromarray(rgb)
del rgb    # ← añadir esta línea
```

### Tarea U-2 — Cerrar buf y img con finally en `_convert_photo`
**Prioridad:** ALTA | **Esfuerzo:** 10 min  
**Impacto:** Garantiza liberación aunque haya excepción en el camino.

```python
# Reemplazar el bloque final de _convert_photo():
buf = io.BytesIO()
try:
    img.save(buf, format="JPEG", quality=85, exif=exif_bytes)
    result = buf.getvalue()
finally:
    buf.close()
    img.close()
return result, capture_dt
```

### Tarea U-3 — Cerrar PIL Images intermedias en `_apply_watermark_fn`
**Prioridad:** ALTA | **Esfuerzo:** 20 min  
**Impacto:** Libera ~80–100 MB de pixel data intermedios por foto; evita acumulación en workers de larga vida.

Objetos a cerrar explícitamente tras su último uso: `wm_src`, `wm`, `wm_rot`, `wm_rgb`, `wm_final`, `overlay`, `result`. Ver código detallado en la auditoría técnica.

### Tarea U-4 — Añadir semáforo de backpressure en `_upload_worker`
**Prioridad:** ALTA | **Esfuerzo:** 30 min  
**Impacto:** Acota los `jpg_bytes` en RAM a `up_workers × 2 × ~4 MB` = ~64 MB máximo, en vez de acumular los de 500 fotos simultáneamente.

```python
# Añadir antes del loop:
upload_sem = threading.Semaphore(up_workers * 2)

# En do_upload(), añadir en el finally:
finally:
    upload_sem.release()

# Antes de self._up_pool.submit():
upload_sem.acquire()
self._up_pool.submit(do_upload, seq, cr3_path, jpg_bytes)
```

### Tarea U-5 — Separar connect/read timeout en `_upload`
**Prioridad:** MEDIA | **Esfuerzo:** 2 min  
**Impacto:** Libera workers colgados en 10s si Railway no responde, en vez de esperar minutos.

```python
# Cambiar en _upload():
timeout=60
# por:
timeout=(10, 60)   # (connect_timeout, read_timeout)
```

**Orden de ejecución:** U-1 → U-2 → U-3 → U-4 → U-5 (todas en el mismo PR)

---

## Plan de ejecución — Galería (image loading)

> Rama: `feature/image-optimization`  
> Base: `develop`  
> Archivos: `PhotoCard.tsx`, `Lightbox.tsx`, `R2StorageService.java`, `application.properties`

### Tarea I-1 — Migrar `<img>` → `next/image` en PhotoCard
**Prioridad:** CRÍTICA | **Esfuerzo:** 20 min  
**Impacto:** Reducción de payload en grid ~85–95%. Una foto de 1.5 MB JPEG pasa a ser ~25 KB WebP en thumbnail.

```tsx
// Reemplazar el <img> en PhotoCard.tsx:
import Image from 'next/image'

<Image
  src={photo.photo_url}
  alt={`Foto ${photo.code}`}
  fill
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  className="photo-protected object-cover transition-transform duration-500 group-hover:scale-105"
  draggable={false}
/>
```

Nota: el `div` padre ya tiene `relative` y `aspect-[3/2]`, `fill` funciona directamente.

### Tarea I-2 — Migrar `<img>` → `next/image` en Lightbox con spinner de carga
**Prioridad:** CRÍTICA | **Esfuerzo:** 20 min  
**Impacto:** Lightbox sirve imagen optimizada; usuario ve spinner en vez de espacio negro durante la carga.

```tsx
// En Lightbox.tsx:
const [loaded, setLoaded] = useState(false)

<div className="relative min-h-0 flex-1 bg-legnar-black" onContextMenu={(e) => e.preventDefault()}>
  {!loaded && (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-legnar-red border-t-transparent animate-spin" />
    </div>
  )}
  <Image
    src={photo.photo_url}
    alt={`Foto ${photo.code}`}
    fill
    sizes="100vw"
    priority
    draggable={false}
    onLoad={() => setLoaded(true)}
    className={`photo-protected object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
  />
</div>
```

### Tarea I-3 — Cache-Control immutable en `R2StorageService.upload()`
**Prioridad:** ALTA | **Esfuerzo:** 5 min  
**Impacto:** Segunda visita a la galería: imágenes desde cache del browser/CDN en <5ms.

```java
// En R2StorageService.java, añadir .cacheControl() al PutObjectRequest:
PutObjectRequest.builder()
    .bucket(bucketName)
    .key(objectKey)
    .contentType("image/jpeg")
    .cacheControl("public, max-age=604800, immutable")  // 7 días
    .build()
```

Requiere también configurar en el panel de Cloudflare (R2 → bucket → Cache Rules):
- Browser TTL: 7 días
- Edge Cache TTL: 30 días

### Tarea I-4 — Implementar proxy `/api/foto/[codigo]`
**Prioridad:** ALTA | **Esfuerzo:** 45 min  
**Impacto:** Oculta URLs de R2 del HTML (requisito de seguridad de CLAUDE.md), habilita control de acceso futuro.

Nueva API route en `app/api/foto/[codigo]/route.ts` que:
1. Recibe el código de la foto
2. Consulta Supabase para obtener la URL real de R2
3. Hace fetch a R2 y retransmite la imagen como stream
4. Añade headers de protección: `Content-Disposition: inline`, `X-Content-Type-Options: nosniff`

Una vez implementado, actualizar `photo.photo_url` en los componentes a `/api/foto/${photo.code}`.

**Nota:** Con el proxy activo, `next/image` apunta a la API route propia de Next.js, así que no necesita `remotePatterns` para R2 en `next.config.ts`. Simplifica la configuración.

### Tarea I-5 — Compresión HTTP en Spring Boot
**Prioridad:** MEDIA | **Esfuerzo:** 2 min  
**Impacto:** Respuestas JSON comprimidas ~60–70%. En 4G con latencia alta, mejora el tiempo de listado de fotos.

```properties
# En application.properties:
server.compression.enabled=true
server.compression.mime-types=application/json,text/plain
server.compression.min-response-size=1024
```

**Orden de ejecución recomendado:** I-1 + I-2 (mismo PR, mayor impacto inmediato) → I-3 (backend PR separado) → I-4 → I-5

---

## Orden global recomendado

| # | Tarea | Repo | Tiempo est. | Impacto |
|---|-------|------|-------------|---------|
| 1 | U-1 + U-2 + U-3 | uploader | 35 min | Elimina riesgo OOM en workers |
| 2 | I-1 + I-2 | frontend | 40 min | -85% payload de imágenes en galería |
| 3 | U-4 + U-5 | uploader | 35 min | Backpressure + timeout upload |
| 4 | I-3 | backend | 5 min | Cache inmutable en R2 |
| 5 | I-4 | frontend | 45 min | Proxy imágenes (seguridad + control) |
| 6 | I-5 | backend | 2 min | Compresión JSON |
| 7 | Auth middleware | frontend | — | Seguridad admin (pendiente anterior) |
| 8 | EXPIRY_DAYS + cron | backend | 5 min | Crítico antes de producción real |

---

## Nota sobre WatermarkService.java

`WatermarkService.java` está declarado como `@Service` pero no está inyectado en `FotoService.java`. El backend sube cualquier JPG que recibe **sin aplicar watermark**. Esto es intencional: el watermark se aplica en el uploader Python antes del upload.

**Riesgo:** si alguien sube directamente a `POST /fotos/upload` (curl, Postman), la foto se mostrará sin watermark. No hay validación de origen en el backend.

**Decisión registrada en:** `DECISIONS.md` entrada 2026-08-13.  
**Acción futura si se habilita otro canal de subida:** re-activar `WatermarkService` en `FotoService` o añadir header secreto de validación de origen.
