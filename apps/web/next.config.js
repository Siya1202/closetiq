/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Allow images served from the local API server
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
      {
        // Allow any HTTPS image (for seeded/demo data)
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
