import {PlatformKoa} from "@tsed/platform-koa";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";

import {rootDir, Server} from "./__mock__/Server.js";

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
