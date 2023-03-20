module.exports = {
  ...require("@tsed/mocha-config")(),
  spec: ["{src,test}/**/*.spec.ts"],
  exclude: [],
  file: ["./test/setup.ts"]
};
