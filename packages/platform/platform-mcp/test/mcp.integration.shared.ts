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
        name: "functional-resource",
        uri: "tsed://resources/functional"
      },
      {
        description: "Returns a static payload for integration tests",
        name: "test",
        propertyKey: "test",
        title: "Test resource",
        uri: "tsed://resources/test"
      },
      {
        name: "error",
        propertyKey: "error",
        uri: "tsed://resources/error"
      },
      {
        name: "serialized",
        propertyKey: "serialized",
        uri: "tsed://resources/serialized"
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

export const expectedSerializedResource = {
  id: 1,
  jsonrpc: "2.0",
  result: {
    contents: [
      {
        mimeType: "application/json",
        text: '{\n  "message": "Hello from serialized resource"\n}',
        uri: "tsed://resources/serialized"
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
        inputSchema: {
          properties: {
            id: {
              type: "string"
            }
          },
          type: "object"
        },
        name: "test-tool",
        outputSchema: {
          properties: {
            hello: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      {
        inputSchema: {
          type: "object"
        },
        name: "serialized-tool",
        outputSchema: {
          properties: {
            hello: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      {
        inputSchema: {
          properties: {},
          type: "object"
        },
        name: "generic-tool",
        outputSchema: {
          properties: {
            data: {
              properties: {
                id: {
                  type: "string"
                }
              },
              type: "object"
            }
          },
          type: "object"
        }
      },
      {
        inputSchema: {
          properties: {
            value: {
              minLength: 1,
              type: "string"
            }
          },
          required: ["value"],
          type: "object"
        },
        name: "functional-tool",
        outputSchema: {
          properties: {
            message: {
              minLength: 1,
              type: "string"
            }
          },
          required: ["message"],
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

function createMcpRequest(request: SuperTest.Agent) {
  return (body: Record<string, unknown>) =>
    request
      .post("/mcp")
      .set({
        Accept: "application/json,text/event-stream",
        "Content-Type": "application/json"
      })
      .send(body);
}

function sortByName<T extends {name: string}>(items: T[]) {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}

export async function assertMcpDiscovery(request: SuperTest.Agent) {
  const sendMcpRequest = createMcpRequest(request);

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
  const resourceList = await sendMcpRequest({jsonrpc: "2.0", id: 1, method: "resources/list", params: {}});
  expect({...resourceList.body, result: {resources: sortByName(resourceList.body.result.resources)}}).toEqual({
    ...expectedResources,
    result: {resources: sortByName(expectedResources.result.resources)}
  });

  const toolList = await sendMcpRequest({jsonrpc: "2.0", id: 1, method: "tools/list", params: {}});
  expect({...toolList.body, result: {tools: sortByName(toolList.body.result.tools)}}).toEqual({
    ...expectedTools,
    result: {tools: sortByName(expectedTools.result.tools)}
  });
}

export async function assertExplicitMcpResponses(request: SuperTest.Agent) {
  const sendMcpRequest = createMcpRequest(request);

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

export async function assertSerializedMcpResponses(request: SuperTest.Agent) {
  const sendMcpRequest = createMcpRequest(request);

  expect(
    (
      await sendMcpRequest({
        jsonrpc: "2.0",
        id: 1,
        method: "resources/read",
        params: {
          uri: "tsed://resources/serialized"
        }
      })
    ).body
  ).toEqual(expectedSerializedResource);

  expect(
    (
      await sendMcpRequest({
        jsonrpc: "2.0",
        id: 1,
        method: "resources/read",
        params: {
          uri: "tsed://resources/functional"
        }
      })
    ).body
  ).toEqual({
    id: 1,
    jsonrpc: "2.0",
    result: {
      contents: [
        {
          mimeType: "application/json",
          text: '{\n  "message": "Hello from functional resource"\n}',
          uri: "tsed://resources/functional"
        }
      ]
    }
  });

  const serializedToolCall = await sendMcpRequest({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "serialized-tool",
      arguments: {}
    }
  });

  expect(serializedToolCall.body).toEqual({
    id: 1,
    jsonrpc: "2.0",
    result: {
      content: [
        {
          type: "text",
          text: '{\n  "hello": "serialized"\n}'
        }
      ],
      structuredContent: {
        hello: "serialized"
      }
    }
  });

  expect(
    (
      await sendMcpRequest({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "functional-tool",
          arguments: {
            value: "from functional tool"
          }
        }
      })
    ).body
  ).toEqual({
    id: 1,
    jsonrpc: "2.0",
    result: {
      content: [
        {
          type: "text",
          text: '{\n  "message": "Hello from functional tool"\n}'
        }
      ],
      structuredContent: {
        message: "Hello from functional tool"
      }
    }
  });

  expect(
    (
      await sendMcpRequest({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "generic-tool",
          arguments: {}
        }
      })
    ).body
  ).toEqual({
    id: 1,
    jsonrpc: "2.0",
    result: {
      content: [
        {
          type: "text",
          text: '{\n  "data": {\n    "id": "generic-data"\n  }\n}'
        }
      ],
      structuredContent: {
        data: {
          id: "generic-data"
        }
      }
    }
  });
}

export async function assertMcpErrorResponses(request: SuperTest.Agent) {
  const sendMcpRequest = createMcpRequest(request);

  const invalidTool = await sendMcpRequest({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "functional-tool",
      arguments: {
        value: ""
      }
    }
  });

  expect(invalidTool.body).toMatchObject({
    id: 1,
    jsonrpc: "2.0",
    result: {
      isError: true,
      content: [
        {
          type: "text",
          text: expect.stringContaining("Input validation error")
        }
      ]
    }
  });

  const resourceError = await sendMcpRequest({
    jsonrpc: "2.0",
    id: 1,
    method: "resources/read",
    params: {
      uri: "tsed://resources/error"
    }
  });

  expect(resourceError.body).toMatchObject({
    id: 1,
    jsonrpc: "2.0",
    result: {
      contents: [
        {
          mimeType: "plain/text",
          text: "Resource failed",
          uri: "tsed://resources/error"
        },
        {
          mimeType: "application/json",
          text: expect.stringContaining("E_MCP_RESOURCE_ERROR"),
          uri: "tsed://resources/error"
        }
      ]
    }
  });

  const toolError = await sendMcpRequest({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "test-tool",
      arguments: {
        id: "error"
      }
    }
  });

  expect(toolError.body).toMatchObject({
    id: 1,
    jsonrpc: "2.0",
    result: {
      isError: true,
      content: [
        {
          type: "text",
          text: expect.stringContaining("E_MCP_TOOL_ERROR")
        }
      ],
      structuredContent: {
        code: "E_MCP_TOOL_ERROR",
        message: "Tool failed",
        tool: "test-tool"
      }
    }
  });
}
