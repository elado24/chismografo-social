import { getServerSession } from "next-auth";
import { demoUser } from "@/data/demo";
import { authOptions } from "@/lib/auth";

export type AppUser = {
  id: string;
  name: string;
  username: string;
  image?: string | null;
  email?: string | null;
};

function usernameFromName(name?: string | null, email?: string | null) {
  const source = name || email?.split("@")[0] || "invitado";
  return source
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, ".")
    .replace(/[.]{2,}/g, ".")
    .replace(/^\.|\.$/g, "")
    .slice(0, 24);
}

export async function getCurrentUser(): Promise<AppUser> {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return {
      id: demoUser.id,
      name: demoUser.name,
      username: demoUser.username,
      image: demoUser.avatar
    };
  }

  return {
    id: user.email ?? user.name ?? demoUser.id,
    name: user.name ?? "Invitado",
    username: usernameFromName(user.name, user.email),
    image: user.image,
    email: user.email
  };
}
