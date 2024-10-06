module.exports = require("@tsed/webpack-config").create({
  root: __dirname,
  name: "event-emitter",
  entry: {
    main: "./src/index.ts"
  },
  externals: ["@tsed/core", "@tsed/schema", "@tsed/di"]
});
