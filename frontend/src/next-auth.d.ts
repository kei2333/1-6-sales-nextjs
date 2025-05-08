import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string;
    region?: number;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean | null;
      role: string;
      region: number;
    };
  }

  interface JWT {
    role?: string;
    region?: number;
  }
}
