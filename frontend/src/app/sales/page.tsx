'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";  // useRouter をインポート

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // ページがロードされた時に /app/sales/today へリダイレクト
    router.push('/sales/today');
  }, [router]);

  return null;  // リダイレクトが行われるので、レンダリングは不要
}
