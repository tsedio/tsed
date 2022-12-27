const webpack = require("webpack");

module.exports = require("@tsed/webpack-config").create({
  root: __dirname,
  name: "schema",
  externals: {
    "@tsed/core": "@tsed/core"
  },
  resolve: {
    alias: {
      picomatch: require.resolve("picomatch-browser/posix")
    }
  }
});
