import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qzlekbammjjfcwfsknvj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/images/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
