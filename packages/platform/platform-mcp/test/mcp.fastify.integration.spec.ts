import {PlatformFastify} from "@tsed/platform-fastify";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import SuperTest from "supertest";

import {rootDir, Server} from "./app/Server.js";
import {assertMcpSuite} from "./mcp.integration.shared.js";

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformFastify as any,
  server: Server,
  logger: {
    level: "off"
  }
});

describe("MCP with fastify", () => {
  beforeAll(
    utils.bootstrap({
      mcp: {
        path: "/mcp"
      }
    })
  );

  afterAll(() => utils.reset());

  it("should handle MCP requests", async () => {
    await assertMcpSuite(SuperTest(PlatformTest.callback()));
  });
});
