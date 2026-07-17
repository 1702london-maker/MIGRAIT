/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/app', destination: '/app/dashboard', permanent: false },
    ]
  },
}

export default nextConfig
