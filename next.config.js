module.exports = {
  async rewrites() {
    return [
      {
        source: "/demo/:slug*",
        destination: "/assets/:slug*",
      },
      {
        source: "/demo",
        destination: "/assets",
      },
    ]
  },
  images: {
    domains: ["assets.coingecko.com"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/assets",
        permanent: true,
      },
    ]
  },
}
