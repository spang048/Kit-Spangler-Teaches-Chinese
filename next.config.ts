import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /\.json$/,
      handler: "CacheFirst",
      options: { cacheName: "json-cache", expiration: { maxEntries: 200 } },
    },
    {
      urlPattern: /\.(png|jpg|svg|mp3|wav)$/,
      handler: "CacheFirst",
      options: { cacheName: "asset-cache", expiration: { maxEntries: 100 } },
    },
    {
      urlPattern: /\/api\//,
      handler: "NetworkFirst",
      options: { cacheName: "api-cache" },
    },
  ],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Turbopack is default in Next.js 16; next-pwa uses webpack internally.
  // An empty turbopack config satisfies Turbopack's requirement.
  turbopack: {},
};

export default withPWA(nextConfig);
