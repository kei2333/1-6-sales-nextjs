import { DefaultUser, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified: Date | null;
      role: string;
      location_id: number;
      employee_number: number;
      employee_name: string; // ✅ 追加
    };
    error?: string | null;
  }

  interface User extends DefaultUser {
    role?: string;
    location_id?: number;
    employee_number?: number;
    employee_name?: string; // ✅ 追加
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    name?: string;
    email?: string;
    emailVerified?: boolean | null;
    role?: string;
    location_id?: number;
    employee_number?: number;
    employee_name?: string; // ✅ 追加
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}
