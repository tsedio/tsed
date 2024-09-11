module.exports = require("@tsed/webpack-config").create({
  root: __dirname,
  name: "di",
  entry: {
    main: "./src/common/index.ts"
  },
  externals: ["@tsed/core", "@tsed/schema"]
});
