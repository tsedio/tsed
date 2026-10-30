// Versions shared by every target, so that only the Ts.ED code differs between two targets.
// Update them together and on purpose: a third-party upgrade changes the baseline.
export const THIRD_PARTY = {
  express: "5.2.1",
  "body-parser": "2.2.1",
  multer: "2.1.1",
  koa: "3.1.2",
  "koa-bodyparser": "4.4.1",
  "koa-qs": "3.0.0",
  "koa-session": "6.4.0",
  "koa-compress": "5.1.1",
  "koa-override": "4.0.0",
  "@koa/router": "13.1.0",
  fastify: "5.8.3",
  "@fastify/accepts": "5.0.2",
  "@fastify/cookie": "11.0.1",
  "@fastify/formbody": "8.0.1",
  "@fastify/middie": "9.2.0",
  "@fastify/static": "8.1.1",
  "fastify-raw-body": "5.0.0",
  ajv: "8.17.1",
  "ajv-formats": "3.0.1",
  "ajv-errors": "3.0.0",
  "@tsed/logger": "8.0.4",
  "@tsed/logger-std": "8.0.4",
  "reflect-metadata": "0.2.2",
  tslib: "2.8.1"
};

// Third-party packages a raw app needs.
export const RAW_DEPENDENCIES = ["express", "koa", "@koa/router", "koa-bodyparser", "fastify"];

export const PLATFORMS = ["express", "koa", "fastify"];

// Packages the bench app imports. The other @tsed/* packages come from their dependency closure.
export const ROOT_PACKAGES = ["@tsed/platform-express", "@tsed/platform-koa", "@tsed/platform-fastify", "@tsed/ajv"];

export const platformPackage = (platform) => `@tsed/platform-${platform}`;
