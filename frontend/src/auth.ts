import NextAuth from "next-auth";
import MicrosoftEntraIDProvider from "next-auth/providers/microsoft-entra-id";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ConfidentialClientApplication } from "@azure/msal-node";

const msalInstance = new ConfidentialClientApplication({
  auth: {
    clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID!,
    clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET!,
    authority: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
  },
});

async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await msalInstance.acquireTokenByRefreshToken({
      refreshToken,
      scopes: ["openid", "profile", "email"],
    });

    if (!response?.accessToken) throw new Error("Failed to refresh access token");

    return {
      idToken: response.idToken,
      accessToken: response.accessToken,
      expiresAt: response.expiresOn?.getTime() ?? Date.now() + 3600 * 1000,
    };
  } catch (error) {
    console.error("refreshAccessToken error:", error);
    return null;
  }
}

// 拡張用ユーザー型
type ExtendedUser = {
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role?: string;
  location_id?: number;
  employee_number?: number;
  employee_name?: string;
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },

  providers: [
    MicrosoftEntraIDProvider({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID!,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
      authorization: { params: { scope: "openid profile email offline_access" } },
    }),
  ],

  pages: {
    error: "/login",
  },

  callbacks: {
    async signIn({ user, profile }) {
      try {
        const resolvedEmail =
          user.email || profile?.email || profile?.preferred_username;

        if (!resolvedEmail) {
          console.error("signIn error: email not found");
          return false;
        }

        const res = await fetch(
          `${process.env.BASE_API_URL_PYTHON}/get_employee_callback?employee_address=${resolvedEmail}`
        );

        if (!res.ok) {
          console.error(`Backend API error: ${res.status}`);
          return false;
        }

        const data = await res.json();

        if (!data.employee_role || data.employee_role === "権限なし") {
          console.warn(`User ${resolvedEmail} has no valid role`);
          return false;
        }

        const extendedUser = user as ExtendedUser;
        extendedUser.role = data.employee_role;
        extendedUser.location_id = data.location_id;
        extendedUser.employee_number = data.employee_number;
        extendedUser.employee_name = data.employee_name;

        return true;
      } catch (error) {
        console.error("signIn callback error:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (account) {
        const decoded = account.id_token
          ? (jwt.decode(account.id_token) as JwtPayload | null)
          : null;

        token.emailVerified =
          decoded && typeof decoded === "object" && "email_verified" in decoded
            ? decoded.email_verified ?? null
            : null;

        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_in
          ? Date.now() + account.expires_in * 1000
          : undefined;
      }

      if (user) {
        const extendedUser = user as ExtendedUser;
        token.role = extendedUser.role;
        token.location_id = extendedUser.location_id;
        token.employee_number = extendedUser.employee_number;
        token.employee_name = extendedUser.employee_name;
      }

      if (token.expiresAt && Date.now() >= token.expiresAt && token.refreshToken) {
        const refreshed = await refreshAccessToken(token.refreshToken);
        if (refreshed) {
          token.idToken = refreshed.idToken;
          token.accessToken = refreshed.accessToken;
          token.expiresAt = refreshed.expiresAt;
        } else {
          token.error = "FAILED_TO_REFRESH_ACCESS_TOKEN";
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.sub!,
        name: token.employee_name || token.name || "不明なユーザー",
        email: token.email!,
        emailVerified: token.emailVerified === true ? new Date() : null,
        role: token.role ?? "",
        location_id: token.location_id ?? 0,
        employee_number: token.employee_number ?? 0,
        employee_name: token.employee_name ?? "",
      };
      session.error = token.error ?? null;
      return session;
    },
  },
});
