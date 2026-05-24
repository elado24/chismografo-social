# Chismógrafo Social: arquitectura de producto

## Visión

Chismógrafo Social es un juego social móvil-first donde cada respuesta puede mencionar amigos, disparar notificaciones, generar una tarjeta compartible y alimentar un ranking semanal. El MVP usa datos locales para la demo, pero la estructura está lista para PostgreSQL, Prisma, Redis, Socket.io, Cloudinary y auth social.

## Capas

- **Web app:** Next.js App Router, React, TypeScript, TailwindCSS y Framer Motion.
- **API:** Route Handlers de Next para preguntas, respuestas, feed, notificaciones y auth.
- **Datos:** Prisma + PostgreSQL con modelos para usuarios, preguntas, respuestas, menciones, reacciones, invitaciones, reportes y notificaciones.
- **Tiempo real:** `publishRealtime` centraliza eventos. En producción publica a Redis pub/sub y Socket.io los entrega por usuario.
- **Media:** Cloudinary para avatares, tarjetas story y screenshots generados.
- **Moderación:** filtro local inicial + cola de revisión + futura moderación IA.

## Estructura

```txt
app/
  api/
    answers/route.ts
    auth/[...nextauth]/route.ts
    feed/route.ts
    notifications/route.ts
    questions/route.ts
  share/[slug]/page.tsx
  u/[username]/page.tsx
  globals.css
  layout.tsx
  page.tsx
data/
  demo.ts
  questions.ts
lib/
  auth.ts
  moderation.ts
  prisma.ts
  realtime.ts
prisma/
  schema.prisma
  seed.ts
public/
docs/
```

## Endpoints MVP

- `GET /api/questions?category=CHISME&mode=FIESTA`: lista preguntas filtradas.
- `GET /api/feed`: feed viral inicial.
- `GET /api/notifications`: notificaciones del usuario actual.
- `POST /api/answers`: valida, modera, extrae menciones y emite eventos realtime.
- `POST /api/reactions`: registra reacciones y aumenta score.
- `POST /api/reports`: crea reportes de abuso.
- `POST /api/blocks`: bloquea usuarios.
- `POST /api/invites`: crea links de invitación.
- `GET /api/og/[slug]`: imagen social dinámica.
- `GET|POST /api/auth/[...nextauth]`: login con Google, Facebook y TikTok.

## Flujo de menciones

1. El usuario responde una pregunta y escribe `@username`.
2. `POST /api/answers` valida longitud y seguridad.
3. `extractMentions` obtiene usuarios mencionados.
4. Se crea `Answer`, `Mention` y `Notification`.
5. `publishRealtime` emite evento `mention` a Redis.
6. Socket.io entrega al canal privado del usuario mencionado.
7. La UI muestra badge, contador y CTA para reaccionar o responder.

## Feed viral

Ranking sugerido para producción:

```txt
score = reactions * 2 + comments * 3 + shares * 7 + mentions * 4
      + recencyBoost + streakBoost - reportPenalty
```

El feed debe mezclar:

- respuestas de amigos,
- respuestas calientes por categoría,
- retos semanales,
- preguntas recién desbloqueadas,
- respuestas donde el usuario fue mencionado.

## IA y personalización

- Generación de preguntas con guardrails por categoría, edad y modo.
- Detección de tendencias por tags, shares, retención y velocidad de respuesta.
- Recomendación por afinidad: categorías preferidas, amigos frecuentes, hora activa y respuestas anteriores.
- Moderación semántica antes de publicar y revisión asincrónica para contenido reportado.

## Anti abuso

- Bloquear insultos, autolesión, doxxing, spam y menciones masivas.
- Rate limit por IP, usuario y dispositivo.
- Cooldown si un usuario menciona repetidamente a la misma persona.
- Reportes con cola de revisión.
- Modo menor de edad: sin preguntas sexuales, sin anónimo agresivo, mensajes limitados.
- Botón bloquear usuario y ocultar menciones.

## Monetización

- Premium: temas, perfil animado, preguntas exclusivas, estadísticas avanzadas.
- Boosts: promover respuesta en ranking por tiempo limitado con límites éticos.
- Ads: recompensados para desbloquear paquetes de preguntas.
- Marcas: retos patrocinados con plantillas de story.

## Escalabilidad

- Vercel para frontend/API.
- PostgreSQL gestionado con índices por `createdAt`, `score`, `mentionedUserId`.
- Redis para caché de feed, contadores y pub/sub.
- Workers para screenshots, moderación IA, rankings semanales y notificaciones push.
- Cloudinary para imágenes y transformaciones Open Graph.
- Separar servicio realtime cuando el tráfico supere el runtime serverless.
