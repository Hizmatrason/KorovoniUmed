import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "5000" },
      { protocol: "https", hostname: "caravanofhope.tj" },
      { protocol: "https", hostname: "www.caravanofhope.tj" },
    ],
  },
};

export default withNextIntl(nextConfig);
