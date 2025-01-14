/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/name-generator' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/name-generator/' : '',
  trailingSlash: true
}

module.exports = nextConfig