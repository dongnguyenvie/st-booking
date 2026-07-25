/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['http://localhost:4001'],
  // Required for Docker standalone build
  output: 'standalone',
};

export default nextConfig;
