const { ProvidePlugin } = require("webpack");

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer/"),
      assert: require.resolve("assert/"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser"),
      url: require.resolve("url/"),
    },
  };

  config.plugins = [
    ...config.plugins,
    new ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ];

  if (process.env.NODE_ENV === "production") {
    config.devtool = false;
  }

  return config;
};