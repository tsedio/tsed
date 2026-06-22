import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import SuperTest from "supertest";

import {rootDir, Server} from "./app/Server.js";
import {assertMcpSuite} from "./mcp.integration.shared.js";

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformExpress as any,
  server: Server,
  logger: {
    level: "off"
  }
});

describe("MCP with express", () => {
  beforeEach(
    utils.bootstrap({
      mcp: {
        path: "/mcp"
      }
    })
  );

  afterEach(() => utils.reset());

  it("should handle MCP requests", async () => {
    await assertMcpSuite(SuperTest(PlatformTest.callback()));
  });
});
