/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出
  output: 'export',
  basePath: '/image_cloud',
  distDir: 'build',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: 'raw.githubusercontent.com',
      },
      {
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
}

export default nextConfig
