import type SuperTest from "supertest";

export const expectedPing = {
  id: 1,
  jsonrpc: "2.0",
  result: {}
};

export const expectedPrompts = {
  id: 1,
  jsonrpc: "2.0",
  result: {
    prompts: [
      {
        description: "Description",
        name: "prompt",
        title: "Title"
      }
    ]
  }
};

export const expectedPrompt = {
  id: 1,
  jsonrpc: "2.0",
  result: {
    description: "Integration prompt response",
    messages: [
      {
        content: [
          {
            text: "Use @tsed/platform-mcp to interact with tools and resources.",
            type: "text"
          }
        ],
        role: "assistant"
      }
    ]
  }
};

export const expectedResources = {
  id: 1,
  jsonrpc: "2.0",
  result: {
    resources: [
      {
        description: "Returns a static payload for integration tests",
        name: "test",
        propertyKey: "test",
        title: "Test resource",
        uri: "tsed://resources/test"
      }
    ]
  }
};

export const expectedResource = {
  id: 1,
  jsonrpc: "2.0",
  result: {
    contents: [
      {
        mimeType: "text/plain",
        text: "Hello from TestResource",
        uri: "tsed://resources/test"
      }
    ]
  }
};

export const expectedTools = {
  id: 1,
  jsonrpc: "2.0",
  result: {
    tools: [
      {
        description: "Test description",
        execution: {
          taskSupport: "forbidden"
        },
        inputSchema: {
          $schema: "http://json-schema.org/draft-07/schema#",
          properties: {
            id: {
              type: "string"
            }
          },
          type: "object"
        },
        name: "test-tool",
        outputSchema: {
          $schema: "http://json-schema.org/draft-07/schema#",
          additionalProperties: false,
          properties: {
            hello: {
              type: "string"
            }
          },
          type: "object"
        }
      }
    ]
  }
};

export const expectedToolCall = {
  id: 1,
  jsonrpc: "2.0",
  result: {
    content: [
      {
        text: "Processed tool invocation for 123",
        type: "text"
      }
    ],
    structuredContent: {
      hello: "world"
    }
  }
};

export async function assertMcpSuite(request: SuperTest.Agent) {
  const sendMcpRequest = (body: Record<string, unknown>) =>
    request
      .post("/mcp")
      .set({
        Accept: "application/json,text/event-stream",
        "Content-Type": "application/json"
      })
      .send(body);

  expect((await sendMcpRequest({jsonrpc: "2.0", id: 1, method: "ping", params: {}})).body).toEqual(expectedPing);
  expect((await sendMcpRequest({jsonrpc: "2.0", id: 1, method: "prompts/list", params: {}})).body).toEqual(expectedPrompts);
  expect(
    (
      await sendMcpRequest({
        jsonrpc: "2.0",
        id: 1,
        method: "prompts/get",
        params: {
          name: "prompt"
        }
      })
    ).body
  ).toEqual(expectedPrompt);
  expect((await sendMcpRequest({jsonrpc: "2.0", id: 1, method: "resources/list", params: {}})).body).toEqual(expectedResources);
  expect(
    (
      await sendMcpRequest({
        jsonrpc: "2.0",
        id: 1,
        method: "resources/read",
        params: {
          uri: "tsed://resources/test"
        }
      })
    ).body
  ).toEqual(expectedResource);
  expect((await sendMcpRequest({jsonrpc: "2.0", id: 1, method: "tools/list", params: {}})).body).toEqual(expectedTools);

  const toolCall = await sendMcpRequest({
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

  expect(toolCall.status).toBe(200);
  expect(toolCall.body).toEqual(expectedToolCall);
}
