const {join} = require("path");
const fixPath = require("normalize-path");
process.env.NODE_ENV = "test";

const rootDir = __dirname;

module.exports = () => ({
  require: ["ts-node/register/transpile-only", "tsconfig-paths/register", fixPath(join(rootDir, "register"))],
  recursive: true,
  reporter: "dot",
  spec: ["packages/**/*.spec.ts"],
  exclude: [
    "packages/orm/**/*.spec.ts",
    "packages/graphql/**/*.spec.ts",
    "packages/utils/**/*.spec.ts",
    "packages/security/oidc-provider/**/*.spec.ts",
    "packages/platform/platform-serverless/**/*.spec.ts",
    "packages/platform/platform-serverless-http/**/*.spec.ts",
    "packages/platform/platform-serverless-testing/**/*.spec.ts",
    "packages/platform/platform-log-middleware/**/*.spec.ts",
    "packages/third-parties/formio/**/*.spec.ts",
    "packages/third-parties/schema-formio/**/*.spec.ts"
  ],
  timeout: 10000
});
