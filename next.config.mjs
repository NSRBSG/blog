/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: join(__dirname, '../../'),
  experimental: {
    turbotrace: {},
  },
};

export default nextConfig;
