module.exports = {
  require: [
    "ts-node/register/transpile-only",
    "tsconfig-paths/register",
    "scripts/mocha/register"
  ],
  recursive: true,
  reporter: "dot",
  spec: [
    "src/**/*.spec.ts"
  ]
};
