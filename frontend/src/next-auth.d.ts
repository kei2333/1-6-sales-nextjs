import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean | null;
      role: string;
      location_id: number;
    };
    error?: string | null;
  }

  interface User extends DefaultUser {
    role?: string;
    location_id?: number;
  }

  interface JWT {
    sub?: string;
    name?: string;
    email?: string;
    emailVerified?: boolean | null;
    role?: string;
    location_id?: number;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}
