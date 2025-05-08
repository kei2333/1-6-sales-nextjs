import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Vercelビルド時にESLintエラーを無視
  },
  // App Router を有効化
  experimental: {
    appDir: true, // Appディレクトリを有効にする設定
  },
  // middlewareの設定
  middleware: {
    matcher: ["/admin", "/sales", "/users"], // このパスに対して適用
  },
};

export default nextConfig;
