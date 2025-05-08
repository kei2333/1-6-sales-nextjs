import jwt, { JwtPayload } from "jsonwebtoken";
import type { NextAuthConfig } from "next-auth";
import { ConfidentialClientApplication } from "@azure/msal-node";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

const msalInstance = new ConfidentialClientApplication({
  auth: {
    clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
    clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET!,
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

export const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET,
      issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
      authorization: { params: { scope: "openid profile email offline_access" } },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const res = await fetch(`${process.env.BASE_API_URL_PYTHON}/get_employee_callback?email=${user.email}`);
        if (!res.ok) return false;

        const data = await res.json();
        if (!data.employee_role || data.employee_role === "not_employed") return false;

        user.role = data.employee_role;
        user.location_id = data.location_id;

        return true;
      } catch (e) {
        console.error("signIn error:", e);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (account) {
        const { id_token, access_token, refresh_token, expires_in } = account;
        if (id_token) {
          const decoded = jwt.decode(id_token) as JwtPayload;
          token.emailVerified = decoded?.email_verified ?? null;
        }
        token.accessToken = access_token ?? token.accessToken;
        token.refreshToken = refresh_token ?? token.refreshToken;
        token.expiresAt = expires_in ? Date.now() + expires_in * 1000 : token.expiresAt;
        token.error = undefined;
      }

      if (user) {
        token.role = user.role;
        token.location_id = user.location_id;
      }

      let isExpiredToken = false;
      if (typeof token.expiresAt === "number") {
        isExpiredToken = Date.now() >= token.expiresAt;
      }

      if (isExpiredToken && typeof token.refreshToken === "string") {
        const refreshedTokens = await refreshAccessToken(token.refreshToken);
        if (refreshedTokens && refreshedTokens.accessToken) {
          token.idToken = refreshedTokens.idToken;
          token.accessToken = refreshedTokens.accessToken;
          token.expiresAt = refreshedTokens.expiresAt;
          token.error = undefined;
        } else {
          token.error = "FAILED_TO_REFRESH_ACCESS_TOKEN";
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.sub!,
        name: token.name!,
        email: token.email!,
        emailVerified: token.emailVerified ?? null,
        role: token.role,
        location_id: token.location_id,
      };
      session.error = token.error ?? null;
      return session;
    },
  },
};
