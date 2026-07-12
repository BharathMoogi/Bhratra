import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable gzip compression for all responses
  compress: true,

  // Configure allowed image origins for next/image optimization
  images: {
    remotePatterns: [
      {
        // Supabase storage (avatars, verification docs, chat attachments)
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Google OAuth avatars
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    // AVIF first (≈50% smaller than WebP), WebP as fallback
    formats: ["image/avif", "image/webp"],
    // Common breakpoints — avoids generating unused intermediate sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Allow Vercel Image Optimization to serve stale-while-revalidate
    minimumCacheTTL: 60,
  },

  // Client-side navigation cache TTL (seconds)
  // Static routes: 5 min | Dynamic routes with loading.tsx: 30 s
  experimental: {
    staleTimes: {
      static: 300,
      dynamic: 30,
    },
    // Tree-shake lucide-react and framer-motion — only bundle icons/exports actually imported
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
