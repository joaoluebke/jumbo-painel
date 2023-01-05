/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['jumbo-app-image.s3.amazonaws.com']
  }
}

module.exports = nextConfig
