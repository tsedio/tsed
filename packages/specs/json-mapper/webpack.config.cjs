const webpack = require("webpack");

module.exports = require("@tsed/webpack-config").create({
  root: __dirname,
  name: "json-mapper",
  externals: {
    "@tsed/core": "@tsed/core",
    "@tsed/schema": "@tsed/schema"
  },
  resolve: {
    alias: {
      picomatch: require.resolve("picomatch-browser")
    }
  }
});
