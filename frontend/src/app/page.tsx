'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push('/login');
    } else {
      // 認証後の待機を3秒挟む
      const timer = setTimeout(() => {
        setDelayed(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [session, status, router]);

  useEffect(() => {
    if (delayed && session) {
      const role = session.user.role;
      if (role === 'Sales') {
        router.push('/sales');
      } else if (role === 'Manager') {
        router.push('/admin/dashboard');
      } else if (role === 'IT') {
        router.push('/users');
      } else {
        router.push('/');
      }
    }
  }, [delayed, session, router]);

  if (status === "loading" || (session && !delayed)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">認証が完了しました。準備中です…</p>
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return null;
}
