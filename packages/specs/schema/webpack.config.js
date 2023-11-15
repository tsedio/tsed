module.exports = require("@tsed/webpack-config").create({
  root: __dirname,
  name: "schema",
  externals: {
    "@tsed/core": "@tsed/core",
    "change-case": "change-case"
  },
  resolve: {
    alias: {
      picomatch: require.resolve("picomatch-browser")
    }
  }
});
