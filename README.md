# Chismógrafo Social

MVP de juego social viral inspirado en el chismógrafo clásico: preguntas atrevidas, menciones, feed vertical, notificaciones, ranking social y páginas compartibles para Facebook/TikTok.

## Incluye

- Next.js + React + TypeScript.
- TailwindCSS + Framer Motion.
- Prisma schema para PostgreSQL.
- Auth preparada para Google, Facebook y TikTok.
- APIs para preguntas, feed, respuestas y notificaciones.
- APIs para reacciones, reportes, bloqueos e invitaciones.
- Imagen Open Graph dinámica por respuesta.
- Moderación inicial anti abuso.
- Sistema de menciones con publicación realtime preparada.
- Open Graph y rutas compartibles.
- Documentación de arquitectura, deploy, growth y roadmap.

## Ejecutar

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Producción

1. Copiar `.env.example` a `.env`.
2. Configurar PostgreSQL, Redis, Cloudinary y OAuth social.
3. Ejecutar migraciones Prisma.
4. Desplegar en Vercel o infraestructura equivalente.

Más detalles en `docs/DEPLOYMENT.md`.

## Documentación

- `docs/ARCHITECTURE.md`
- `docs/API.md`
- `docs/REALTIME.md`
- `docs/VERCEL_QUICKSTART.md`
- `docs/GROWTH.md`
- `docs/ROADMAP.md`
