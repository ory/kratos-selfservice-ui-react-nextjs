/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  output: process.env.DISABLE_STANDALONE === 'true' ? undefined : 'standalone',
}
