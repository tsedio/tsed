process.env.NODE_ENV = "test";

module.exports = {
  require: [
    "ts-node/register/transpile-only",
    "tsconfig-paths/register",
    "tasks/mocha/register"
  ],
  recursive: true,
  reporter: "dot",
  spec: [
    "packages/**/*.spec.ts"
  ]
};
