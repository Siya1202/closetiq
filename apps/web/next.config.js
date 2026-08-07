/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Allow Cloudinary uploads
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // Allow legacy local uploads
        protocol: "http",
        hostname: "localhost",
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
