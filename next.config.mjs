/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    appDir: true,
    optimizePackageImports: ['@chakra-ui/react'],
  },
}

export default nextConfig
