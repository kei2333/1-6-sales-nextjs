import type {  NextAuthOptions  } from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"
import NextAuth from "next-auth"

// Fetch userdata database via API (https) -> EntraID login -> fetch email from EntraID ->
//  define email as profile.preferred_username -> pull userdata database & search email ->
//  return false if no match, return true and change callback using '"ifs"
// Httpslink "https://team6-sales-function.azurewebsites.net/api/get_employee_callback"

export const authOptions = {
    proveders: [
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID!,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
            tenantId: process.env.AZURE_AD_TENANT_ID!,
        }),
    ],
    callbacks: {
        async jwt({  token, account, profile  })  {
            if (account && profile) {
                // Azure AD (Entra ID) からのメールアドレスを保存
                token.email = profile.email || profile.preferred_username
            }
            return token
        },
        async session({  session, token  }) {
            //Session.user にメールアドレスを入れる
            session.user.email = token.email
            return session
        },
        async signIn({  user  }) {
            //許可するユーザーのメールアドレス一覧
            const allowedEmails = [
                'TCS2025_TP_class1_27@uhd.onmicrosoft.com',
                'user2@example.com'
            ]
            if (allowedEmails.includes(user.email!)) {
                return true //許可
            }
            console.warn('Unathorized login attempt by ${user.email}')
            return false //拒否
        },
    },
} satisfies NextAuthOptions

export const {  handlers, auth, signIn, signOut  } = NextAuth(authOptions)