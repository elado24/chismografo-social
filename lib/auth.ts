import type { NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import type { OAuthConfig } from "next-auth/providers/oauth";

type TikTokProfile = {
  open_id: string;
  union_id?: string;
  avatar_url?: string;
  display_name?: string;
};

const TikTokProvider = {
  id: "tiktok",
  name: "TikTok",
  type: "oauth",
  authorization: {
    url: "https://www.tiktok.com/v2/auth/authorize/",
    params: {
      scope: "user.info.basic",
      response_type: "code"
    }
  },
  token: "https://open.tiktokapis.com/v2/oauth/token/",
  userinfo: "https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name",
  clientId: process.env.TIKTOK_CLIENT_ID,
  clientSecret: process.env.TIKTOK_CLIENT_SECRET,
  profile(profile: { data: { user: TikTokProfile } }) {
    const user = profile.data.user;
    return {
      id: user.open_id,
      name: user.display_name ?? "TikToker",
      email: null,
      image: user.avatar_url
    };
  }
} satisfies OAuthConfig<{ data: { user: TikTokProfile } }>;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? ""
    }),
    TikTokProvider
  ],
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.name = session.user.name ?? token.name;
      }
      return session;
    }
  },
  pages: {
    signIn: "/"
  }
};
