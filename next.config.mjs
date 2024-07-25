import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: join(
    dirname(fileURLToPath(import.meta.url)),
    '../../'
  ),
};

export default nextConfig;
