import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";

import {rootDir, Server} from "./__mock__/Server.js";

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
