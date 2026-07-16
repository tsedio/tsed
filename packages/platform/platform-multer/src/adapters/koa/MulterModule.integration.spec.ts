import {Server, rootDir} from "./__mock__/Server.js";
import {PlatformKoa} from "@tsed/platform-koa";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformKoa as any,
  server: Server,
  logger: {
    level: "off"
  }
});

describe("PlatformKoa", () => {
  describe("Plugin: Multer", () => {
    utils.test("multer");
  });
});
