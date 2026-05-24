export type RealtimeEvent =
  | {
      type: "mention";
      userId: string;
      payload: {
        from: string;
        question: string;
        answer: string;
        shareSlug: string;
      };
    }
  | {
      type: "ranking";
      userId: string;
      payload: { title: string; body: string };
    };

export async function publishRealtime(event: RealtimeEvent) {
  // Production path: publish to Redis pub/sub, then fan out through Socket.io.
  // The demo keeps this side-effect free so API routes work without external services.
  console.info("[realtime]", event.type, event.userId, event.payload);
}

export const socketEvents = {
  connectUser: "user:connect",
  notificationNew: "notification:new",
  mentionNew: "mention:new",
  rankingUpdated: "ranking:updated",
  feedHot: "feed:hot"
} as const;
