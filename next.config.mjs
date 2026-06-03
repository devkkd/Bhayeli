/** @type {import('next').NextConfig} */
const nextConfig = {
  // Limit build workers to reduce peak memory on low-RAM hosts (Render free tier = 512MB)
  experimental: {
    workerThreads: false,
    cpus: 1,
  },

  // Keep standalone output for Render deployment
  output: 'standalone',

  // Don't bundle heavy server-only packages — load them at runtime
  serverExternalPackages: ['mongoose', '@aws-sdk/client-s3'],

  // Disable source maps in production to save memory during build
  productionBrowserSourceMaps: false,
};

export default nextConfig;
