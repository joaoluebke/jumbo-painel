/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['jumbo-app-image.s3.amazonaws.com', 'jumbo.co.ao']
  }
}

module.exports = nextConfig
