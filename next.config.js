/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL
  },
  images: {
    domains: ['utfs.io']
  }
}

module.exports = nextConfig
