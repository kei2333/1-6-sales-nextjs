'use client';

import { signIn } from 'next-auth/react';
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#BAC43E]/40 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">売上管理おまかせくん</h1>

      <div className="w-full max-w-sm bg-white p-8 rounded shadow-md space-y-6">
        <div>
          <Button
            className="w-full bg-green-700 hover:bg-green-800 text-white"
            onClick={() => signIn('microsoft-entra-id')}
          >
            Sign in with Microsoft
          </Button>

          <p className="mt-4 text-xs text-gray-600 text-center">
            ログインできない方は{" "}
            <a
              href="mailto:kohkishibata@aaa.com"
              className="text-blue-600 underline hover:text-blue-800"
            >
              管理者にお問い合わせください。
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
