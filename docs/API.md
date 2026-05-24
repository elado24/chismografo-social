# API de producción

## Preguntas

`GET /api/questions`

Query params:

- `category`: `TODAS`, `CHISME`, `ROMANCE`, `HUMOR`, `AMISTAD`, `VIRAL`
- `mode`: `FIESTA`, `PAREJA`, `AMIGOS`, `ANONIMO`

## Respuestas

`POST /api/answers`

```json
{
  "questionId": "q_1",
  "question": "¿Quién tiene más red flags?",
  "body": "@luis.mov pero cae bien",
  "isAnonymous": false
}
```

Hace:

- rate limit,
- moderación,
- extracción de menciones,
- creación de respuesta,
- creación de menciones/notificaciones,
- evento realtime,
- push en cola,
- link compartible.

## Feed

`GET /api/feed`

Devuelve respuestas virales ordenadas por score cuando hay base de datos; si no, usa datos demo.

## Notificaciones

`GET /api/notifications`

`POST /api/notifications/read`

```json
{
  "ids": ["notification_id"]
}
```

Si `ids` no se envía, marca todas como leídas.

## Reacciones

`POST /api/reactions`

```json
{
  "answerId": "answer_id",
  "emoji": "fire"
}
```

Emojis permitidos: `heart`, `fire`, `laugh`, `tea`, `shock`.

## Reportes

`POST /api/reports`

```json
{
  "answerId": "answer_id",
  "reportedUsername": "usuario",
  "reason": "Acoso o insultos"
}
```

## Bloqueos

`POST /api/blocks`

```json
{
  "blockedUsername": "usuario",
  "reason": "No quiero recibir menciones"
}
```

## Invitaciones

`POST /api/invites`

Devuelve un link con `utm_source=invite`.

## Open Graph dinámico

`GET /api/og/[slug]`

Genera una imagen social 1200x630 para Facebook, TikTok previews y enlaces compartidos.

## Push

`POST /api/push/subscribe`

```json
{
  "endpoint": "https://push-service/...",
  "keys": {
    "p256dh": "browser-key",
    "auth": "browser-auth-secret"
  }
}
```

Guarda una suscripción Web Push para avisos de menciones cuando el usuario esté offline.
