/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/css-problems-demo',
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
