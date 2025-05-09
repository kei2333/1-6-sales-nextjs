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
    };
    error?: string | null;
  }

  interface User extends DefaultUser {
    role?: string;
    location_id?: number;
    employee_number?: number;
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
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}
