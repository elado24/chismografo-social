export type PushPayload = {
  userId: string;
  title: string;
  body: string;
  url?: string;
  badge?: number;
};

export async function enqueuePush(payload: PushPayload) {
  // Production path:
  // 1. Store subscriptions in PostgreSQL.
  // 2. Queue this payload in Redis/BullMQ.
  // 3. A worker sends Web Push or native push later.
  console.info("[push]", payload.userId, payload.title);
}
