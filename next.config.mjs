/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [ new URL('https://flagcdn.com/') ],
  },
 
}

export default nextConfig
