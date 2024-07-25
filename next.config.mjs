/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    turbotrace: {},
  },
};

export default nextConfig;
