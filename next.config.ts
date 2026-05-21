import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow server action payloads up to 25 MB so admin uploads can include
  // audio files. The default 1 MB limit blocks anything bigger than text-only
  // forms, which is fine for end users but blocks our admin file uploads.
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },

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
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "**",
      },
      // Optional: Add more domains here later (e.g., Unsplash, your own CDN)
    ],
  },
};

export default nextConfig;