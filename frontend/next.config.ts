/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Vercel/Azure ビルド時に ESLint エラー無視
  },
  experimental: {
    optimizeCss: false, // ✅ LightningCSS を無効化 → next/fontのビルドエラー回避
  },
  // 他に設定があればここに追加
}

export default nextConfig
