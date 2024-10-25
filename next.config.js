/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/tech',
  assetPrefix: '/tech/',
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
