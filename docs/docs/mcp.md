---
head:
  - - meta
    - name: description
      content: Learn how to expose Model Context Protocol (MCP) endpoints with Ts.ED using @tsed/platform-mcp, including functional helpers, decorators, and CLI references.
  - - meta
    - name: keywords
      content: ts.ed mcp model context protocol ai llm tools prompts resources express fastify koa platform platform-mcp cli
---

# Model Context Protocol (MCP)

`@tsed/platform-mcp` brings [Model Context Protocol](https://modelcontextprotocol.io) support to every Ts.ED HTTP
adapter. The module exposes a configurable `/mcp` endpoint, lets you register tools/resources/prompts through DI-aware
helpers or decorators, and reuses the same MCP primitives that power the CLI integration.

::: tip Need a standalone CLI implementation?
Use [`@tsed/cli-mcp`](https://cli.tsed.dev/guide/cli/mcp.html) (Ts.ED CLI v7) to generate a streamable or stdio MCP
server that ships with the same functional API. The CLI package is ideal for headless agents, while
`@tsed/platform-mcp` embeds MCP inside your HTTP application.
:::

## Installation

::: code-group

```bash [npm]
npm install @tsed/platform-mcp
```

```bash [yarn]
yarn add @tsed/platform-mcp
```

```bash [pnpm]
pnpm add @tsed/platform-mcp
```

```bash [bun]
bun add @tsed/platform-mcp
```

:::

```typescript [src/Server.ts]
import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/platform-mcp";

@Configuration({
  mcp: {
    path: "/mcp" // defaults to "/mcp"
  }
})
export class Server {}
```

Register your MCP providers in the `mcp` configuration so the module can expose them through the HTTP endpoint:

```typescript [src/Server.ts]
import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/platform-mcp";

import {TestPrompt} from "./prompts/TestPrompt.js";
import {TestResource} from "./resources/TestResource.js";
import {TestTool} from "./tools/TestTool.js";

@Configuration({
  mcp: {
    prompts: [TestPrompt],
    resources: [TestResource],
    tools: [TestTool]
  }
})
export class Server {}
```

All registration helpers return DI tokens. Add those tokens to a module `providers` array, or expose them from a
feature module. Both the decorators and the function API execute handlers inside a Ts.ED `DIContext`, so you can reuse
your existing providers and services.

## Register tools

Tools expose executable actions to MCP clients. Use them for operations that take structured input and return content
or structured results, such as querying a service, triggering a workflow, or composing data from your application.
With decorators, the preferred approach is to declare Ts.ED models and let the framework derive both the input and the
output schemas from the method signature and response metadata.

::: code-group

```typescript [Decorators]
import {Injectable} from "@tsed/di";
import {Tool} from "@tsed/platform-mcp";
import {Description, Property, Returns} from "@tsed/schema";

class HelloInput {
  @Property()
  name: string;
}

class HelloOutput {
  @Property()
  message: string;
}

@Injectable()
export class HelloTool {
  @Tool("hello")
  @Description("Greets callers from any MCP client")
  @Returns(200, HelloOutput)
  async handle(input: HelloInput) {
    return {
      content: [
        {
          type: "text",
          text: `Hello, ${input.name}!`
        }
      ],
      structuredContent: {
        message: `Hello, ${input.name}!`
      }
    };
  }
}
```

```typescript [Function API]
import {defineTool} from "@tsed/platform-mcp";
import {s} from "@tsed/schema";

export const helloTool = defineTool({
  name: "hello",
  title: "Hello",
  description: "Greets callers from any MCP client",
  inputSchema: s
    .object({
      name: s.string().required()
    })
    .required(),
  outputSchema: s
    .object({
      message: s.string().required()
    })
    .required(),
  async handler({name}) {
    return {
      content: [
        {
          type: "text",
          text: `Hello, ${name}!`
        }
      ],
      structuredContent: {
        message: `Hello, ${name}!`
      }
    };
  }
});
```

:::

## Register resources

Resources expose addressable content that clients can discover and read later by URI. Use them for static or dynamic
documents, generated files, configuration snapshots, or any other content that should be fetched as a resource.

::: code-group

```typescript [Decorators]
import {Injectable} from "@tsed/di";
import {Resource} from "@tsed/platform-mcp";

@Injectable()
export class McpResources {
  @Resource("tsed://docs/index", {
    name: "docs",
    title: "Internal documentation",
    description: "Returns the internal MCP documentation"
  })
  readDocs() {
    return {
      contents: [
        {
          uri: "tsed://docs/index",
          mimeType: "text/markdown",
          text: "Internal doc content"
        }
      ]
    };
  }
}
```

```typescript [Function API]
import {defineResource} from "@tsed/platform-mcp";

export const docsResource = defineResource({
  name: "docs",
  title: "Internal documentation",
  description: "Returns the internal MCP documentation",
  uri: "tsed://docs/index",
  handler() {
    return {
      contents: [
        {
          uri: "tsed://docs/index",
          mimeType: "text/markdown",
          text: "Internal doc content"
        }
      ]
    };
  }
});
```

:::

## Register prompts

Prompts expose reusable prompt templates that MCP clients can request on demand. Use them to generate consistent
conversation starters, assistant instructions, or parameterized user messages from your Ts.ED application.

::: code-group

```typescript [Decorators]
import {Injectable} from "@tsed/di";
import {Prompt} from "@tsed/platform-mcp";

@Injectable()
export class McpPrompts {
  @Prompt({
    name: "ask-tsed",
    title: "Ask Ts.ED",
    description: "Creates a prompt message for Ts.ED questions"
  })
  askTsed({question}: {question: string}) {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: question
          }
        }
      ]
    };
  }
}
```

```typescript [Function API]
import {definePrompt} from "@tsed/platform-mcp";
import {s} from "@tsed/schema";

export const askTsedPrompt = definePrompt({
  name: "ask-tsed",
  title: "Ask Ts.ED",
  description: "Creates a prompt message for Ts.ED questions",
  argsSchema: s
    .object({
      question: s.string().required()
    })
    .required(),
  handler({question}) {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: question
          }
        }
      ]
    };
  }
});
```

:::

## Customising the endpoint

Set `mcp.path` or `mcp.enabled` to control how the transport is exposed:

```typescript
@Configuration({
  mcp: {
    path: "/ai/mcp",
    enabled: process.env.MCP_DISABLED !== "true"
  }
})
```

All Ts.ED adapters (Express, Fastify, Koa) forward `POST <path>` requests to
`@modelcontextprotocol/sdk`'s `StreamableHTTPServerTransport`, so any MCP-capable client (Claude Desktop, etc.) can talk
with your server regardless of the underlying framework.

## Testing and inspector

With `@tsed/platform-mcp`, your MCP server is exposed through your Ts.ED HTTP application. The usual integration test
strategy is to bootstrap the server with `PlatformTest`, then exercise `POST /mcp` with `supertest` to verify that
tools, resources, and prompts are correctly registered and reachable through the transport.

```typescript
const response = await request.post("/mcp").set({
  Accept: "application/json,text/event-stream",
  "Content-Type": "application/json"
});
```

If you want to inspect the server manually, start your Ts.ED application and point the MCP Inspector to the HTTP
endpoint exposed by `@tsed/platform-mcp`:

```bash
npx @modelcontextprotocol/inspector
```

Then configure the inspector to use the `Streamable HTTP` transport with your server URL, for example:

```text
http://localhost:8083/mcp
```

::: tip
If you also need a standalone CLI distribution that speaks MCP over `stdio` or standalone HTTP, use
[`@tsed/cli-mcp`](https://cli.tsed.dev/guide/cli/mcp.html). The decorators and function helpers are designed to stay
close across both packages, so moving handlers between CLI and platform integrations does not require rewriting the MCP
logic.
:::
