import { NextResponse } from "next/server";
import { listNotifications } from "@/lib/repository";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  const notifications = await listNotifications(user);

  return NextResponse.json({
    notifications,
    unread: notifications.filter((item) => item.unread).length
  });
}
