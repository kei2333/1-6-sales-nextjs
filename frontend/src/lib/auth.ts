import type {  NextAuthOptions  } from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"
import NextAuth from "next-auth"

// Fetch userdata database via API (https) -> EntraID login -> fetch email from EntraID ->
//  define email as profile.preferred_username -> pull userdata database & search email ->
//  return false if no match, return true and change callback using '"ifs"
// Link "https://team6-sales-function.azurewebsites.net/api/get_employee_callback"

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const res = await fetch(// Azure AD (Entra ID) からのメールアドレスを保存
          '${process.env.PYTHON_API_BASE_URL}/get_employee_callback?email=${encodeURIComponent(user.email!)}',
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        if (!res.ok) {
          console.error('Failed to fetch employee data: ${res.status}')
          return false
        }

        const employee = await res.json()

        if (!employee || employee.employee_role === "NOT_EMPLOYED") {//データベースにアドレスはあるがログインさせない処理
          console.warn('Access denied for ${user.email} with role ${employee?.employee_role}')
          return false
        }

        // ロールをトークンに格納するために session/jwt コールバックで扱う
        user.role = employee.employee_role

        return true
      } catch (error) {
        console.error('Error checking employee role: ${error}')
        return false
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.email = user.email
        token.role = user.role // signIn コールバックで詰めた role を入れる
      }
      return token
    },

    async session({ session, token }) {//Session.user にメールアドレスを入れる
      session.user.email = token.email
      session.user.role = token.role
      return session
    },

    async redirect({ baseUrl, url }) {
      // トークンからロールを取得し、リダイレクト先を決定
      const parsedUrl = new URL(url, baseUrl)
      const role = parsedUrl.searchParams.get("role")

      if (role === "EMP") {
        return '${baseUrl}/emp-page'
      } else if (role === "MANAGER") {
        return '${baseUrl}/manager-page'
      } else if (role === "IT") {
        return '${baseUrl}/it-page'
      }
      return baseUrl
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
