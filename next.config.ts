import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "turf-app-bucket.s3.ap-south-1.amazonaws.com", // AWS S3 bucket domain
    ],
  },
};

export default nextConfig;
