const {join} = require("path");
const fixPath = require("normalize-path");
process.env.NODE_ENV = "test";

const rootDir = __dirname;

module.exports = () => ({
  require: [
    !process.argv.includes("ts-node/register") && "ts-node/register/transpile-only",
    "tsconfig-paths/register",
    fixPath(join(rootDir, "register"))
  ].filter(Boolean),
  recursive: true,
  reporter: "dot",
  spec: ["packages/**/*.spec.ts"],
  exclude: [
    "packages/core/**/*.spec.ts",
    "packages/di/**/*.spec.ts",
    "packages/orm/**/*.spec.ts",
    "packages/graphql/**/*.spec.ts",
    "packages/security/**/*.spec.ts",
    "packages/specs/**/*.spec.ts",
    "packages/platform/common/**/*.spec.ts",
    "packages/platform/platform-aws/**/*.spec.ts",
    "packages/platform/platform-middlewares/**/*.spec.ts",
    "packages/platform/platform-params/**/*.spec.ts",
    "packages/platform/platform-response-filter/**/*.spec.ts",
    "packages/platform/platform-exceptions/**/*.spec.ts",
    "packages/platform/platform-cache/**/*.spec.ts",
    "packages/platform/platform-serverless/**/*.spec.ts",
    "packages/platform/platform-serverless-http/**/*.spec.ts",
    "packages/platform/platform-serverless-testing/**/*.spec.ts",
    "packages/platform/platform-log-middleware/**/*.spec.ts",
    "packages/platform/platform-views/**/*.spec.ts",
    "packages/third-parties/**/*.spec.ts",
    "packages/engines/**/*.spec.ts"
  ],
  timeout: 10000
});
