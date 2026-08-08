@AGENTS.md

# CLAUDE.md — Legnarapex · Orbexa Systems

Este archivo va en la raíz del proyecto Legnarapex. Claude Code lo lee automáticamente al iniciar sesión.

---

## Protocolo de inicio de sesión

Cuando el usuario diga **"inicio de sesion"** (o variante como "iniciamos", "nueva sesion"), ejecutar automáticamente estos pasos antes de responder cualquier otra cosa:

1. Leer `STATUS.md` en la raíz del proyecto (`../STATUS.md` relativo a este archivo)
2. Correr en `legnarapex-frontend/`:
   ```bash
   git log --oneline -8
   git branch -a
   git status
   ```
3. Dar un briefing estructurado con:
   - **Rama actual** y si tiene cambios sin commitear
   - **Últimos commits** (qué se hizo la sesión anterior)
   - **Estado del proyecto** según `STATUS.md`
   - **Sugerencia de qué trabajar** en esta sesión según los pendientes

Este briefing debe ser conciso — máximo 20 líneas. El objetivo es que el usuario pueda arrancar a trabajar en menos de un minuto.

---

## Idioma y estilo de comunicación

- Todos los prompts, comentarios de commits y explicaciones en **español**.
- El código (variables, funciones, clases, interfaces, tipos) en **inglés**, siguiendo convención estándar de la industria.
- Los comentarios dentro del código siempre en **inglés**, sin excepción.

---

## Modo de trabajo

- Actúa como implementador autónomo: una vez que la tarea esté clara, ejecuta de principio a fin sin pedir confirmación en cada paso.
- Minimiza los check-ins intermedios. Pregunta solo cuando:
  - La decisión afecta arquitectura o modelo de datos de forma difícil de revertir.
  - Hay ambigüedad real que no se puede resolver con un supuesto razonable.
  - Se requiere una credencial, API key, o acceso que no está disponible.
- Si tomas un supuesto para avanzar, decláralo brevemente y continúa — no te detengas a esperar aprobación por cosas menores.

---

## Control de versiones (obligatorio)

- **NUNCA** hacer commit ni push directamente a `main` o `develop`.
- Todas las ramas nuevas se crean **a partir de `develop`**, salvo que se indique explícitamente otra base.
- Antes de cualquier cambio de código, crear un branch nuevo:
  - `feature/nombre-de-la-funcionalidad`
  - `fix/descripcion-del-bug`
  - `chore/tarea-de-mantenimiento`
- Los cambios llegan a `develop` vía PR. `develop` llega a `main` vía PR cuando hay una versión lista.
- **Repositorio:** `github.com/orbexasystems/legnarapex`

### Estructura de ramas

```
main        ← producción — solo recibe merges desde develop
develop     ← integración — base de todas las ramas de trabajo
  └─ feature/*, fix/*, chore/*   ← trabajo diario
```

### Flujo obligatorio antes de mergear

Un branch NO puede mergearse a `main` sin cumplir estos pasos en orden:

1. `npm run build` — sin errores de compilación
2. Prueba manual del cambio en el navegador (describir brevemente qué se probó)
3. Verificar que el flujo afectado sigue funcionando end-to-end
4. Si el cambio toca el admin: probar login → acción → resultado
5. Si el cambio toca la galería pública: probar búsqueda → lightbox → CTA WhatsApp
6. Documentar en el PR qué se probó y en qué browser

Si alguno de estos pasos falla o no se puede verificar, **no mergear** — abrir issue o continuar en el branch.

---

## Documentación de decisiones

Mantén un archivo `DECISIONS.md` en la raíz del proyecto. Cada decisión relevante se agrega como entrada breve:

```
## [fecha] Título de la decisión
**Contexto:** por qué surgió la decisión
**Decisión:** qué se eligió
**Alternativas consideradas:** (si aplica)
```

Decisiones que SÍ documentar en este proyecto:
- Cambios en el tiempo de expiración de fotos (actualmente 8 días)
- Cambios en la estrategia de protección contra descarga
- Cambios en el procesamiento de imágenes (marca de agua, conversión)
- Decisiones sobre almacenamiento (Cloudflare R2, estructura de carpetas)
- Cambios en el flujo de búsqueda de fotos

---

## Tests obligatorios

**Todo código nuevo debe incluir su test.** Un cambio sin test no se considera terminado.

### Frontend (Next.js)
- **Lógica de negocio** (cálculos, transformaciones, helpers): test unitario con Jest/Vitest en `__tests__/`
- **Server Actions**: test que verifique el happy path y al menos un caso de error
- **Componentes nuevos**: test de renderizado básico con React Testing Library
- **API routes**: test de integración que cubra respuesta exitosa y casos de error (401, 502, etc.)

### Backend (Spring Boot)
- **Servicios** (`FotoService`, `WatermarkService`, etc.): test unitario con JUnit 5 + Mockito
- **Controladores REST**: test con `@WebMvcTest` cubriendo status codes y estructura del response
- **Cron jobs**: test unitario de la lógica de selección (qué fotos se eliminan)
- **Lógica de extracción EXIF**: test unitario con archivos de prueba en `src/test/resources/`

### Regla de excepción
Si un cambio es **exclusivamente de UI/estilos** (colores, espaciados, fuentes) y no modifica lógica, puede omitir test — documentarlo en el PR.

---

## Verificación y pruebas

- Antes de dar por terminada una tarea, verificar:
  1. `npm run build` sin errores en el frontend
  2. `mvn compile` sin errores en el backend Spring Boot
  3. Que el cron job de limpieza no elimine fotos activas en tests manuales
  4. Que la protección contra descarga funcione en Chrome y Safari (click derecho, inspeccionar elemento, drag)
- El proyecto no tiene tests automatizados todavía — describir brevemente cómo se probó manualmente cada cambio

---

## Stack del proyecto

### Frontend
- **Next.js 14+** con App Router
- **Tailwind CSS** con tokens de marca en `globals.css`
- **TypeScript** en todos los archivos — sin excepción
- **Supabase Auth** — autenticación del panel admin
- Deploy en **Vercel**

### Backend
- **Spring Boot (Java)** — API REST, procesamiento de imágenes en lote, cron job nocturno
- **Thumbnailator** — aplicación de marca de agua automática sobre JPG
- **Spring Scheduler** — eliminación automática de fotos expiradas (2:00 AM diario)
- **AWS SDK for Java** (compatible con S3 API) — comunicación con Cloudflare R2
- Deploy en **Railway**

### Base de datos
- **PostgreSQL via Supabase**
- RLS habilitado en todas las tablas — nunca deshabilitar RLS para simplificar

### Almacenamiento
- **Cloudflare R2** — bucket `legnarapex-fotos`
- Sin costo de egress (transferencia gratuita) — razón principal de elección sobre AWS S3

---

## Modelo de negocio y contexto del cliente

- Fotografía de motociclismo en **2 pistas fijas**: Pista Norte y Pista Sur
- El fotógrafo opera **todos los fines de semana**
- Las fotos **expiran a los 8 días** — eliminación automática sin intervención manual
- **Sin pasarela de pagos** — el cobro es por transferencia bancaria directa
- **Sin descarga directa** — el cliente solo visualiza con marca de agua y contacta por WhatsApp
- El fotógrafo convierte CR3 → JPG **localmente** antes de subir (acordado con el cliente)
- WhatsApp del cliente: `5625384283`
- Redes sociales: TikTok/Instagram `@legnar_apex`, Facebook `Legnar Apex`

---

## Identidad visual — MUY IMPORTANTE

La marca Legnarapex tiene una estética oscura, agresiva y de velocidad. **Nunca usar colores claros ni estilos genéricos** — todo debe sentirse como adrenalina y velocidad.

### Tokens de marca (`globals.css`)

```css
:root {
  --legnar-black:   #0A0A0A;   /* fondo principal — negro profundo */
  --legnar-dark:    #111111;   /* fondo secundario, cards */
  --legnar-red:     #C0392B;   /* acento principal — rojo fuego */
  --legnar-fire:    #E85D04;   /* acento naranja llama */
  --legnar-gold:    #F48C06;   /* bordes, detalles, highlights */
  --legnar-white:   #F5F5F5;   /* texto principal */
  --legnar-gray:    #9CA3AF;   /* texto secundario */
  --legnar-border:  #1F1F1F;   /* bordes de cards y divisores */
}
```

### Clases Tailwind personalizadas (`tailwind.config.js`)

```js
colors: {
  'legnar-black':  'var(--legnar-black)',
  'legnar-dark':   'var(--legnar-dark)',
  'legnar-red':    'var(--legnar-red)',
  'legnar-fire':   'var(--legnar-fire)',
  'legnar-gold':   'var(--legnar-gold)',
  'legnar-white':  'var(--legnar-white)',
  'legnar-gray':   'var(--legnar-gray)',
  'legnar-border': 'var(--legnar-border)',
}
```

### Reglas de diseño
- **Fondo siempre oscuro** — `legnar-black` o `legnar-dark`, nunca blanco ni gris claro
- **Acentos en rojo/naranja/dorado** — para botones, hovers, badges y elementos activos
- **Texto principal en blanco roto** — nunca negro sobre fondo oscuro
- **Border-radius moderado** — `rounded-lg` (8px) para cards, `rounded-full` para pills
- **Sombras con color** — `shadow` con tono rojizo para elementos destacados: `shadow-legnar-red/20`
- **Nunca hardcodear colores hex** — siempre usar los tokens `var(--legnar-*)` o clases Tailwind

---

## Estructura de rutas

```
/                   → Landing page pública
/galeria            → Búsqueda y visualización de fotos para clientes
/admin              → Panel de administración (protegido)
/admin/login        → Login del admin
/admin/fotos        → Subida de fotos en lote y gestión
/admin/lugares      → Gestión de lugares de operación
```

---

## Estructura de base de datos

### Tabla: `lugares`
```sql
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
nombre      VARCHAR NOT NULL    -- 'Pista Norte' | 'Pista Sur'
activo      BOOLEAN DEFAULT true
created_at  TIMESTAMP DEFAULT now()
```

### Tabla: `fotos`
```sql
id           UUID PRIMARY KEY DEFAULT gen_random_uuid()
codigo       VARCHAR NOT NULL       -- extraído del nombre del archivo (ej: 2V0A9780)
lugar_id     UUID REFERENCES lugares(id)
fecha_foto   DATE NOT NULL          -- extraída del EXIF
hora_foto    TIME NOT NULL          -- extraída del EXIF
url_foto     TEXT NOT NULL          -- URL del JPG con marca de agua en Cloudflare R2
fecha_subida TIMESTAMP DEFAULT now()
expira_en    TIMESTAMP NOT NULL     -- fecha_subida + 8 días (calculado en Spring Boot)
```

### Políticas RLS
```sql
-- Lectura pública — sin autenticación
CREATE POLICY "lugares_public_read" ON lugares
  FOR SELECT USING (activo = true);

CREATE POLICY "fotos_public_read" ON fotos
  FOR SELECT USING (expira_en > now());

-- Escritura solo para usuarios autenticados
CREATE POLICY "fotos_authenticated_write" ON fotos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "lugares_authenticated_write" ON lugares
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## Capa de datos (`lib/data/`)

Todas las consultas a Supabase van en archivos dedicados. Nunca hacer llamadas directas a Supabase desde componentes.

### `lib/data/lugares.ts`
- `getLugares()` — lugares activos para filtros del cliente
- `getLugaresAdmin()` — todos los lugares incluyendo inactivos
- `getLugarById(id)` — para el panel admin

### `lib/data/fotos.ts`
- `getFotosByCriteria({ lugarId, fecha, hora? })` — búsqueda para el cliente
- `getFotosByCodigo(codigo)` — búsqueda directa por código
- `getFotosAdmin()` — todas las fotos activas para el panel admin
- `deleteFoto(id)` — eliminación manual desde el admin

---

## Convenciones de componentes

- **Server Components** por defecto
- `'use client'` solo para interactividad (filtros, lightbox, drag & drop de subida)
- **Server Actions** para operaciones de escritura desde el admin
- Componentes organizados por sección:

```
components/
├── landing/        → Hero, ComoFunciona, GaleriaMuestra, Contacto
├── galeria/        → FiltrosBusqueda, GridFotos, FotoCard, Lightbox
└── admin/          → Sidebar, SubidaFotos, BarraProgreso, ListaFotos, GestionLugares
```

---

## Procesamiento de imágenes (Spring Boot)

El backend es responsable de todo el procesamiento al recibir un JPG:

```java
// Flujo en FotoService.java
public FotoDTO procesarFoto(MultipartFile file, UUID lugarId) {
    // 1. Extraer código del nombre del archivo
    String codigo = extractCodigo(file.getOriginalFilename()); // "2V0A9780.jpg" → "2V0A9780"

    // 2. Leer metadatos EXIF
    LocalDate fechaFoto = exifService.extractDate(file);
    LocalTime horaFoto  = exifService.extractTime(file);

    // 3. Aplicar marca de agua con Thumbnailator
    byte[] jpgConMarcaAgua = watermarkService.apply(file.getBytes());

    // 4. Subir a Cloudflare R2
    String urlFoto = r2Service.upload(jpgConMarcaAgua, codigo);

    // 5. Guardar en PostgreSQL
    LocalDateTime expiraEn = LocalDateTime.now().plusDays(8);
    return fotoRepository.save(new Foto(codigo, lugarId, fechaFoto, horaFoto, urlFoto, expiraEn));
}
```

### Cron job de limpieza (`FotoCleanupScheduler.java`)
```java
@Scheduled(cron = "0 0 2 * * *")  // 2:00 AM todos los días
public void limpiarFotosExpiradas() {
    List<Foto> expiradas = fotoRepository.findByExpiraEnBefore(LocalDateTime.now());
    expiradas.forEach(foto -> {
        r2Service.delete(foto.getUrlFoto());
        fotoRepository.delete(foto);
    });
    log.info("Fotos eliminadas: {}", expiradas.size());
}
```

---

## Protección contra descarga de fotos

La galería pública debe implementar múltiples capas de protección:

### CSS
```css
.foto-protegida {
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}
```

### Next.js — no exponer URL directa en el HTML
Las URLs de Cloudflare R2 nunca deben aparecer en el HTML del cliente. Usar una API route que sirva la imagen como proxy:
```
/api/foto/[codigo] → proxy hacia Cloudflare R2
```
Así el cliente no puede copiar la URL directa de la imagen.

### Headers de respuesta
```
Content-Disposition: inline
X-Content-Type-Options: nosniff
Cache-Control: no-store
```

---

## Botón de WhatsApp

El mensaje predefinido debe incluir el código de la foto para facilitar la búsqueda del fotógrafo:

```typescript
// lib/whatsapp.ts
export function generarLinkWhatsapp(codigo: string): string {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER // 5625384283
  const mensaje = encodeURIComponent(
    `Hola, vi mi foto con el código ${codigo} en Legnarapex, me interesa comprarla 🏍️`
  )
  return `https://wa.me/${numero}?text=${mensaje}`
}
```

---

## Convenciones de commits

Formato imperativo corto en español:

```
Agrega estructura base del proyecto Legnarapex
Implementa subida de fotos en lote con Thumbnailator
Conecta galería pública a Supabase
Agrega protección contra descarga en FotoCard
Configura cron job de limpieza en Spring Boot
Corrige extracción de fecha EXIF en fotos sin metadatos
```

Prefijos opcionales:
- `[backend]` — cambio exclusivo en Spring Boot
- `[fix]` — corrección de bug
- `[chore]` — mantenimiento sin impacto en funcionalidad

---

## Variables de entorno

### Frontend (Next.js)
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=5625384283
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hola, vi mi foto con el código XXXX en Legnarapex, me interesa comprarla 🏍️
```

### Backend (Spring Boot)
```env
SUPABASE_DB_URL=
SUPABASE_DB_USER=
SUPABASE_DB_PASSWORD=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=legnarapex-fotos
R2_PUBLIC_URL=
```

---

## Seguridad

- Nunca subir `.env`, `.env.local`, ni archivos con credenciales al repositorio
- `SUPABASE_SERVICE_ROLE_KEY` solo en Server Components y Server Actions — nunca en Client Components
- Las URLs de Cloudflare R2 nunca expuestas directamente en el HTML del cliente
- Verificar `.gitignore` al iniciar cualquier sesión de trabajo nueva

### .gitignore
```gitignore
# Next.js
.next/
out/
node_modules/

# Variables de entorno
.env
.env.local
.env*.local

# Vercel
.vercel

# Spring Boot
target/
*.jar
*.war
application-local.properties

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# TypeScript
*.tsbuildinfo
next-env.d.ts
```

---

## Contacto y soporte del proyecto

- **Desarrollador:** Daniel — Orbexa Systems
- **Correo:** contacto@orbexasystems.com.mx
- **Sitio:** orbexasystems.com.mx
- **Cliente:** Legnarapex — TikTok/Instagram `@legnar_apex`
