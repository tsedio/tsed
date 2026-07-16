import {Server, rootDir} from "./__mock__/Server.js";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformExpress as any,
  server: Server,
  logger: {
    level: "off"
  }
});

describe("PlatformExpress", () => {
  describe("Plugin: Multer", () => {
    utils.test("multer");
  });
});
