'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // 読み込み中

    if (!session) {
      router.push('/login');
    } else {
      const role = session.user.role;
      if (role === 'Sales') {
        router.push('/sales/today');
      } else if (role === 'Manager') {
        router.push('/admin/dashboard');
      } else if (role === 'IT') {
        router.push('/users');
      } else {
        router.push('/login');
      }
    }
  }, [session, status, router]);

  return null;
}
