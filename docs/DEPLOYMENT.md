# Guía de publicación

## 1. Preparar servicios

- Crear base PostgreSQL.
- Crear Redis gestionado.
- Crear cuenta Cloudinary.
- Registrar apps OAuth en Google, Facebook y TikTok.
- Configurar dominio y callback URLs:
  - `https://tu-dominio.com/api/auth/callback/google`
  - `https://tu-dominio.com/api/auth/callback/facebook`
  - `https://tu-dominio.com/api/auth/callback/tiktok`

## 2. Variables de entorno

Copiar `.env.example` y llenar:

```txt
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
FACEBOOK_CLIENT_ID
FACEBOOK_CLIENT_SECRET
TIKTOK_CLIENT_ID
TIKTOK_CLIENT_SECRET
REDIS_URL
CLOUDINARY_*
```

## 3. Instalar y migrar

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run build
```

## 4. Deploy en Vercel

```bash
vercel
vercel env pull
vercel --prod
```

En producción, mover Socket.io a un servicio persistente si se usa serverless puro. Alternativas: Fly.io, Render, Railway o un gateway WebSocket dedicado.

## 5. Metadata social

La app ya define Open Graph y Twitter Card en `app/layout.tsx` y páginas compartibles en `app/share/[slug]/page.tsx`. Para campañas:

- generar imagen dinámica por respuesta,
- usar título con pregunta,
- usar descripción con respuesta corta,
- adjuntar `utm_source=tiktok` o `utm_source=facebook`.

## 6. Checklist de lanzamiento

- Auth social probado en móvil.
- Reportes y bloqueo visibles.
- Rate limiting activo.
- Política de privacidad y términos.
- Moderación para menores.
- Pruebas de share en Facebook Debugger.
- Pruebas de TikTok in-app browser.
- Lighthouse móvil sobre 90.
