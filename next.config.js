module.exports = {
  async rewrites() {
    return [
      {
        source: "/demo/:slug*",
        destination: "/:slug*",
      },
      {
        source: "/demo",
        destination: "/",
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
