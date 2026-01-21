import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import SuperTest from "supertest";

import {rootDir, Server} from "./app/Server.js";

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformExpress as any,
  server: Server,
  logger: {
    level: "off"
  }
});

describe("MCP", () => {
  let request: SuperTest.Agent;
  const sendMcpRequest = (body: Record<string, unknown>) =>
    request
      .post("/mcp")
      .set({
        Accept: "application/json,text/event-stream",
        "Content-Type": "application/json"
      })
      .send(body);

  beforeEach(
    utils.bootstrap({
      mcp: {
        path: "/mcp"
      }
    })
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(() => utils.reset());
  it("should return all mcp information", async () => {
    const response = await sendMcpRequest({jsonrpc: "2.0", id: 1, method: "ping", params: {}});

    expect(response.body).toMatchInlineSnapshot(`
      {
        "id": 1,
        "jsonrpc": "2.0",
        "result": {},
      }
    `);
  });
  it("should return all prompts", async () => {
    const response = await sendMcpRequest({jsonrpc: "2.0", id: 1, method: "prompts/list", params: {}});

    expect(response.body).toMatchInlineSnapshot(`
      {
        "id": 1,
        "jsonrpc": "2.0",
        "result": {
          "prompts": [
            {
              "description": "Description",
              "name": "prompt",
              "title": "Title",
            },
          ],
        },
      }
    `);
  });
  it("should return all prompts details", async () => {
    const response = await sendMcpRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "prompts/get",
      params: {
        name: "prompt"
      }
    });

    expect(response.body).toMatchInlineSnapshot(`
      {
        "id": 1,
        "jsonrpc": "2.0",
        "result": {
          "description": "Integration prompt response",
          "messages": [
            {
              "content": [
                {
                  "text": "Use @tsed/platform-mcp to interact with tools and resources.",
                  "type": "text",
                },
              ],
              "role": "assistant",
            },
          ],
        },
      }
    `);
  });

  it("should return all resources", async () => {
    const response = await sendMcpRequest({jsonrpc: "2.0", id: 1, method: "resources/list", params: {}});

    expect(response.body).toMatchInlineSnapshot(`
      {
        "id": 1,
        "jsonrpc": "2.0",
        "result": {
          "resources": [
            {
              "description": "Returns a static payload for integration tests",
              "name": "test",
              "propertyKey": "test",
              "title": "Test resource",
              "uri": "tsed://resources/test",
            },
          ],
        },
      }
    `);
  });

  it("should read a resource", async () => {
    const response = await sendMcpRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "resources/read",
      params: {
        uri: "tsed://resources/test"
      }
    });

    expect(response.body).toMatchInlineSnapshot(`
      {
        "id": 1,
        "jsonrpc": "2.0",
        "result": {
          "contents": [
            {
              "mimeType": "text/plain",
              "text": "Hello from TestResource",
              "uri": "tsed://resources/test",
            },
          ],
        },
      }
    `);
  });

  it("should return all tools", async () => {
    const response = await sendMcpRequest({jsonrpc: "2.0", id: 1, method: "tools/list", params: {}});

    expect(response.body).toMatchInlineSnapshot(`
      {
        "id": 1,
        "jsonrpc": "2.0",
        "result": {
          "tools": [
            {
              "description": "Test description",
              "execution": {
                "taskSupport": "forbidden",
              },
              "inputSchema": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "properties": {
                  "id": {
                    "type": "string",
                  },
                },
                "type": "object",
              },
              "name": "test-tool",
              "outputSchema": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "additionalProperties": false,
                "properties": {
                  "hello": {
                    "type": "string",
                  },
                },
                "type": "object",
              },
            },
          ],
        },
      }
    `);
  });
  it("should invoke a tool", async () => {
    const response = await sendMcpRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "test-tool",
        arguments: {
          id: "123"
        }
      }
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchInlineSnapshot(`
      {
        "id": 1,
        "jsonrpc": "2.0",
        "result": {
          "content": [
            {
              "text": "Processed tool invocation for 123",
              "type": "text",
            },
          ],
          "structuredContent": {
            "hello": "world",
          },
        },
      }
    `);
  });
});
