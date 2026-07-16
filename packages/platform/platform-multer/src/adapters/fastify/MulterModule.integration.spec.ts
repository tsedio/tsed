import {Server, rootDir} from "./__mock__/Server.js";
import {PlatformFastify} from "@tsed/platform-fastify";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformFastify as any,
  server: Server,
  logger: {
    level: "error"
  }
});

describe("PlatformFastify", () => {
  describe("Plugin: Multer", () => {
    utils.test("multer");
  });
});
