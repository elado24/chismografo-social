# Realtime, Redis y push

## Eventos

Los eventos están centralizados en `lib/realtime.ts`:

- `mention:new`: una persona fue mencionada.
- `notification:new`: nueva notificación.
- `ranking:updated`: cambió un ranking.
- `feed:hot`: una respuesta entró a tendencia.

## Flujo recomendado

1. API crea respuesta, mención y notificación.
2. API publica evento en Redis pub/sub.
3. Servicio Socket.io persistente escucha Redis.
4. Socket.io emite al room privado `user:{id}`.
5. Si el usuario está offline, `enqueuePush` envía el trabajo a una cola.
6. Worker procesa Web Push o push móvil.

## Rooms

```txt
user:{userId}
question:{questionId}
ranking:weekly
party:{partyCode}
```

## Producción

Vercel sirve bien para la web y APIs normales, pero Socket.io necesita un proceso persistente. Opciones:

- Fly.io,
- Render,
- Railway,
- ECS/Fargate,
- un gateway realtime gestionado.

Redis debe usarse para:

- pub/sub,
- rate limit distribuido,
- caché de feed,
- contadores calientes,
- cola de push/moderación.
