const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase) => {
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    trailingSlash: true,
    ...(phase === PHASE_DEVELOPMENT_SERVER ? {} : { output: 'export' }),
  }

  return nextConfig
}
