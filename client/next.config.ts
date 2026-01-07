import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Re-enable export for build
  // output: 'export', // Disabled for dev mode proxy support
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: 'http://localhost:5000/admin/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
      {
        source: '/css/:path*',
        destination: 'http://localhost:5000/css/:path*',
      },
    ];
  },
};

export default nextConfig;
