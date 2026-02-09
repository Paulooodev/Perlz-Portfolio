import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.stockcake.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "thumbs.dreamstime.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "blog.landr.com",
        pathname: "**",
      },
      // Wildcard for any Supabase project (storage public URLs)
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "**",
      },
      // Optional: Add more domains here later (e.g., Unsplash, your own CDN)
    ],
  },
};

export default nextConfig;