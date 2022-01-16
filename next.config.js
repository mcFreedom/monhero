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
  basePath: "/assets",
}
