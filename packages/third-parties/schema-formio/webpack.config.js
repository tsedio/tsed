module.exports = require("@tsed/webpack-config").create({
  root: __dirname,
  name: "schema-formio",
  externals: {
    "@tsed/core": "@tsed/core",
    "@tsed/schema": "@tsed/schema",
    formiojs: "formiojs",
    lodash: "lodash",
    moment: "moment"
  },
  resolve: {
    alias: {
      picomatch: require.resolve("picomatch-browser/posix")
    }
  }
});
