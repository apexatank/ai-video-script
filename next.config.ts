// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...existing config
  allowedDevOrigins: ['http://192.168.1.15:3000'], // add your dev IP and port
};

module.exports = nextConfig;