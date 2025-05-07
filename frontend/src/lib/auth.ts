import AzureADProvider from "next-auth/providers/azure-ad";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";

export const authOptions = {
    providers: [
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID!,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
            tenantId: process.env.AZURE_AD_TENANT_ID!,
         }),
  ]
} satisfies NextAuthOptions

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)