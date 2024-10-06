/** @type {import('next').NextConfig} */

const API_URL = "http://localhost:8000"; // TODO: use process.env.API_URL

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
