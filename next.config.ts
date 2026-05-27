import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  allowedDevOrigins: [
    "192.168.1.2",
  ],

  // Hide the Next.js dev indicator badge
  devIndicators: false,

  // ── Image Remote Patterns ───────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },

  // ── Security & SEO Headers ──────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Link",
            value: "</sitemap.xml>; rel=\"sitemap\"",
          },
        ],
      },
    ];
  },

  // ── Performance Optimizations ──────────────────────────────
  
  // Disable source maps in development to reduce filesystem writes
  productionBrowserSourceMaps: false,

  // Optimize heavy package imports (tree-shake only used icons/components)
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "framer-motion",
    ],
  },

  // Exclude large paths from output file tracing (speeds up builds)
  outputFileTracingExcludes: {
    "*": [
      "./node_modules/terser/**/*",
      "./node_modules/webpack/**/*",
      "./node_modules/typescript/**/*",
    ],
  },

  // Compress responses
  compress: true,

  // Disable x-powered-by header (minor security + perf)
  poweredByHeader: false,
};

export default nextConfig;
