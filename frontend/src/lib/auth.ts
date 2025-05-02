import type {  NextAuthOptions  } from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad";
import NextAuth from "next-auth";

export const authOptions = {
    providers: [
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID!,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
            tenantId: process.env.AZURE_AD_TENANT_ID!,
         }),
  ]//,
  // callbacks: {
  //   async signIn({ user }) {
  //     // 許可するユーザーのメールアドレス一覧
  //     const allowedEmails = ['TCS2025_TP_class1_27@uhd.onmicrosoft.com', 'user2@example.com'];

  //     if (allowedEmails.includes(user.email)) {
  //       return true; // 許可
  //     }

  //     console.warn(`Unauthorized login attempt by ${user.email}`);
  //     return false; // 拒否
  //   },
  // },
} satisfies NextAuthOptions

export const {  handlers, auth, signIn, signOut  } = NextAuth(authOptions)