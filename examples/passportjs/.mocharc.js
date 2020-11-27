process.env.NODE_ENV = "test";

module.exports = {
  require: [
    "ts-node/register/transpile-only",
    "scripts/mocha/register"
  ],
  recursive: true,
  reporter: "dot",
  spec: [
    "{src,test}/**/*.spec.ts"
  ]
};
