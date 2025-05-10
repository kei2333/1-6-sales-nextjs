'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function LoginClient() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessage = (() => {
    if (!error) return null;

    switch (error) {
      case 'AccessDenied':
        return 'アクセスが拒否されました。権限がありません。';
      case 'OAuthSignin':
        return 'サインイン中にエラーが発生しました。';
      case 'OAuthCallback':
        return '外部サービスからの応答でエラーが発生しました。';
      case 'Configuration':
        return '認証設定に問題があります。';
      case 'SessionRequired':
        return '保護されたページにアクセスするにはログインが必要です。';
      default:
        return 'ログインできませんでした。もう一度お試しください。';
    }
  })();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#BAC43E]/40 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">売上管理おまかせくん</h1>

      <div className="w-full max-w-sm bg-white p-8 rounded shadow-md space-y-6">
        <div>
          {errorMessage && (
            <p className="text-red-600 text-sm text-center mb-4">
              {errorMessage}
            </p>
          )}

          <button
            className="w-full bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded"
            onClick={() => signIn('microsoft-entra-id', { callbackUrl: '/' })}
          >
            Microsoft でログイン
          </button>

          <p className="mt-4 text-xs text-gray-600 text-center">
            ログインできない方は{" "}
            <a
              href="mailto:kohkishibata@aaa.com?subject=売上管理おまかせくんのログインについて"
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
