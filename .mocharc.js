process.env.NODE_ENV = "test";

module.exports = {
  require: [
    "ts-node/register/transpile-only",
    "tsconfig-paths/register",
    "tools/mocha/register"
  ],
  recursive: true,
  reporter: "dot",
  spec: [
    "packages/**/*.spec.ts"
  ],
  timeout: 3000
};
