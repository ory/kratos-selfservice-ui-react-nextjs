/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    // Will be available on both server and client
    NEXT_PUBLIC_AFTER_LOGGED_IN_URL:
      process.env.NEXT_PUBLIC_AFTER_LOGGED_IN_URL,
    NEXT_PUBLIC_FORCE_COOKIE_DOMAIN: process.env.NEXT_PUBLIC_FORCE_COOKIE_DOMAIN
  }
}
