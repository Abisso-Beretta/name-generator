/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: '/name-generator',
  assetPrefix: '/name-generator/'
}

module.exports = nextConfig