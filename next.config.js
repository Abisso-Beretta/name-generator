/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';
const productionPath = '/name-generator';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: isProduction ? productionPath : '',
  assetPrefix: isProduction ? productionPath : '',
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  }
}

module.exports = nextConfig