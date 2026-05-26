# Paso 1: publicar la web en Vercel

Este paso crea una URL pública para que Facebook, TikTok y los usuarios puedan abrir y compartir el juego.

## Opción recomendada: GitHub + Vercel

1. Crear un repositorio en GitHub llamado `chismografo-social`.
2. Subir este proyecto al repositorio.
3. Entrar a Vercel y elegir **Add New Project**.
4. Importar el repositorio `chismografo-social`.
5. Confirmar que Vercel detecta **Next.js**.
6. Agregar variables de entorno.
7. Presionar **Deploy**.

## Variables mínimas para el primer deploy

Para publicar una versión demo sin base real:

```txt
NEXTAUTH_URL=https://TU-PROYECTO.vercel.app
NEXTAUTH_SECRET=un-secreto-largo-y-aleatorio
```

Para producción real:

```txt
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://TU-DOMINIO.com
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
TIKTOK_CLIENT_ID=...
TIKTOK_CLIENT_SECRET=...
REDIS_URL=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Base de datos

La app puede desplegar como demo sin `DATABASE_URL`, porque tiene fallback local. Para usuarios reales, agregar PostgreSQL antes del lanzamiento público.

Después de configurar `DATABASE_URL`, correr:

```bash
npm run prisma:migrate
npm run seed
```

## Dominio

Cuando el deploy funcione:

1. En Vercel, abrir **Settings > Domains**.
2. Agregar el dominio.
3. Cambiar `NEXTAUTH_URL` al dominio final.
4. Redesplegar.

## Prueba final

Abrir:

```txt
https://TU-DOMINIO.com
https://TU-DOMINIO.com/share/famosa-accidental
https://TU-DOMINIO.com/api/og/famosa-accidental
```

Luego probar el link compartible en Facebook Sharing Debugger.
