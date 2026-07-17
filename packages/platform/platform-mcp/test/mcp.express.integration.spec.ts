import {Server, rootDir} from "./app/Server.js";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import SuperTest from "supertest";
import {
  assertExplicitMcpResponses,
  assertMcpDiscovery,
  assertMcpErrorResponses,
  assertSerializedMcpResponses
} from "./mcp.integration.shared.js";

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

  it("should expose the MCP discovery endpoints", async () => {
    await assertMcpDiscovery(SuperTest(PlatformTest.callback()));
  });

  it("should preserve explicit MCP tool and resource responses", async () => {
    await assertExplicitMcpResponses(SuperTest(PlatformTest.callback()));
  });

  it("should serialize plain tool and resource results", async () => {
    await assertSerializedMcpResponses(SuperTest(PlatformTest.callback()));
  });

  it("should return MCP-compatible tool and resource errors", async () => {
    await assertMcpErrorResponses(SuperTest(PlatformTest.callback()));
  });
});
