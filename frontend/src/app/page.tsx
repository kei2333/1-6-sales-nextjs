'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("status:", status);
    console.log("session:", session);

    if (status === "loading") return;

    if (!session) {
      router.push('/login');
    } else {
      const role = session.user.role;
      console.log("role:", role);
      if (role === 'Sales') {
        router.push('/sales/today');
      } else if (role === 'Manager') {
        router.push('/admin/dashboard');
      } else if (role === 'IT') {
        router.push('/users');
      } else {
        router.push('/');
      }
    }
  }, [session, status, router]);

  return null;
}
