/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Desactiva el modo estricto
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/api/images/**',
      }
    ],
    unoptimized: true
  }
};

export default nextConfig;

