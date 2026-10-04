---
description: "Learn how to expose Model Context Protocol (MCP) endpoints with Ts.ED using @tsed/platform-mcp, including functional helpers, decorators, and CLI references."
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
helpers or decorators, and reuses the same MCP primitives that power the CLI integration. An endpoint can also act as a
[gateway](#gateway-expose-a-third-party-mcp-server) for a third-party MCP server and be
[protected with OAuth](#protect-an-endpoint-with-oauth).

::: tip Need a standalone MCP server?
Import [`@tsed/platform-mcp/cli`](#run-an-mcp-server-from-a-cli) to run the same tools, resources, and prompts over
stdio or Streamable HTTP. The CLI entry point does not mount a Ts.ED HTTP application.
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

::: warning Explicit registration required
`@Tool`, `@Prompt`, and `@Resource` do not expose a class automatically. Add each decorated class to the `tools`,
`prompts`, or `resources` array of every MCP server that should expose its handlers. This lets multiple MCP servers
select different provider classes.
:::

All registration helpers return DI tokens. Add those tokens to a module `providers` array, or expose them from a
feature module. Both the decorators and the function API execute handlers inside a Ts.ED `DIContext`, so you can reuse
your existing providers and services.

## Run an MCP server from a CLI

The `@tsed/platform-mcp/cli` entry point creates one MCP server after your CLI has initialized the Ts.ED DI container.
It supports two transports:

- `stdio` for local clients such as MCP Inspector, Claude Desktop, or editor agents;
- `streamable-http` to expose a `POST /mcp` endpoint. It listens on `PORT`, defaulting to `3000`.

The CLI supports one `mcp` configuration object. Use the HTTP module when you need multiple MCP server endpoints.

Import CLI helpers from the CLI entry point and configure the same `mcp` provider arrays used by the HTTP module:

```typescript [src/mcp.ts]
import {Configuration} from "@tsed/di";
import {defineTool, mcpServerConnect} from "@tsed/platform-mcp/cli";

const helloTool = defineTool({
  name: "hello",
  description: "Greets the MCP client",
  handler({name}: {name: string}) {
    return {content: [{type: "text", text: `Hello, ${name}!`}]};
  }
});

@Configuration({
  mcp: {
    name: "my-cli-mcp",
    version: "1.0.0",
    tools: [helloTool]
  }
})
export class McpConfiguration {}

// Call this after the CLI bootstrap has initialized the Ts.ED injector.
await mcpServerConnect("stdio");
// Or expose POST /mcp on process.env.PORT (default: 3000):
// await mcpServerConnect("streamable-http");
```

When using `stdio`, reserve standard output for the MCP protocol: do not write application logs or diagnostic output to
`stdout`. The transport helper stops the Ts.ED logger before connecting, but child processes and custom logging must
also write to `stderr`. For Streamable HTTP, protect the endpoint with authentication and run it behind the same
network controls as other privileged CLI services.

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

### Structured Response serialization <Badge text="v8.36.0+" />

When a @@defineTool@@ handler returns a plain object, Ts.ED serializes it with the tool name and the `tools` group,
then creates both the JSON text `content` and `structuredContent` required by MCP. This lets handlers return their
domain result directly instead of manually duplicating it in an MCP response.

The generated input and output schemas use the same groups and preserve property aliases. Return a complete MCP result
only when you need custom content, such as multiple messages or a non-JSON content type; it is passed through unchanged.

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
      message: `Hello, ${input.name}!`
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
      message: `Hello, ${name}!`
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

Unlike `@Tool`, `@Prompt` does not infer the arguments schema from the method parameter: declare `argsSchema`
explicitly when the prompt accepts arguments.

::: code-group

```typescript [Decorators]
import {Injectable} from "@tsed/di";
import {Prompt} from "@tsed/platform-mcp";
import {s} from "@tsed/schema";

@Injectable()
export class McpPrompts {
  @Prompt({
    name: "ask-tsed",
    title: "Ask Ts.ED",
    description: "Creates a prompt message for Ts.ED questions",
    argsSchema: s
      .object({
        question: s.string().required()
      })
      .required()
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

## Error handling

`defineTool`, `defineResource`, and `definePrompt` wrap handler execution in `try/catch`.
When a handler throws, Ts.ED logs a structured event and returns a fallback MCP payload instead of re-throwing.

Error code resolution follows this rule:

- if `error.name` and `error.status` are present: `E_MCP_<KIND>_<CONSTANT_CASE(error.name)>` (via `change-case`)
- otherwise: `E_MCP_<KIND>_ERROR`

`status_code` is `error.status`; it is omitted when the error has no status.

### Tool errors

- log event: `MCP_TOOL_ERROR`
- fallback response: `isError` is set to `true`, the error payload is returned in `structuredContent` and as a JSON
  text entry in `content`:

```json
{
  "isError": true,
  "content": [
    {
      "type": "text",
      "text": "{\n  \"status_code\": 500,\n  \"code\": \"E_MCP_TOOL_INTERNAL_SERVER_ERROR\",\n  \"message\": \"Something went wrong\",\n  \"tool\": \"my-tool\"\n}"
    }
  ],
  "structuredContent": {
    "status_code": 500,
    "code": "E_MCP_TOOL_INTERNAL_SERVER_ERROR",
    "message": "Something went wrong",
    "tool": "my-tool"
  }
}
```

### Resource errors

- log event: `MCP_RESOURCE_ERROR`
- fallback response: two `contents` entries for the requested URI, the error message as plain text followed by the
  error payload as JSON:

```json
{
  "contents": [
    {
      "uri": "tsed://docs/index",
      "mimeType": "text/plain",
      "text": "Resource not found"
    },
    {
      "uri": "tsed://docs/index",
      "mimeType": "application/json",
      "text": "{\n  \"status_code\": 404,\n  \"code\": \"E_MCP_RESOURCE_NOT_FOUND\",\n  \"error_name\": \"NOT_FOUND\",\n  \"message\": \"Resource not found\",\n  \"request_id\": \"<tsed-di-context-id>\",\n  \"resource\": \"docs\"\n}"
    }
  ]
}
```

### Prompt errors

- log event: `MCP_PROMPT_ERROR`
- fallback response: `description` is set to the error message, `messages` is empty and the error payload is returned
  in `_meta`:

```json
{
  "description": "Prompt execution failed",
  "messages": [],
  "_meta": {
    "status_code": 400,
    "code": "E_MCP_PROMPT_BAD_REQUEST",
    "message": "Prompt execution failed",
    "request_id": "<tsed-di-context-id>",
    "prompt": "ask-tsed"
  }
}
```

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

### Expose multiple MCP servers

`mcp` also accepts an array. Each entry creates an independent MCP server and mounts its own `POST` endpoint. This is
useful when clients or domains need distinct endpoint paths, server metadata, or transport options.

```typescript [src/Server.ts]
import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/platform-mcp";

@Configuration({
  mcp: [
    {
      name: "catalog",
      path: "/mcp/catalog"
    },
    {
      name: "administration",
      path: "/mcp/admin",
      transportOptions: {enableJsonResponse: true}
    }
  ]
})
export class Server {}
```

Each configuration is resolved once while routes are initialized. A new `McpServer` and Streamable HTTP transport are
created for every request, so concurrent requests and server shutdowns remain isolated. Set `enabled: false` on one
entry to leave that endpoint unmounted without affecting the others.

Provider registration is declarative: a server only registers the tokens and decorated classes listed in its `tools`,
`resources`, and `prompts` arrays. A decorated class contributes all of its handlers to that MCP server; it is not
automatically exposed by other MCP configurations.

The CLI exposes a single `/mcp` endpoint; use one MCP configuration when starting it with `mcpServerConnect`.

All Ts.ED adapters (Express, Fastify, Koa) forward `POST <path>` requests to
`@modelcontextprotocol/node`'s `NodeStreamableHTTPServerTransport`, connected to a `McpServer` from
`@modelcontextprotocol/server`, so any MCP-capable client (Claude Desktop, etc.) can talk with your server regardless
of the underlying framework.

## Gateway: expose a third-party MCP server <Badge text="v8.42.0+" />

An MCP endpoint can act as a gateway for a third-party MCP server. Declare it under `upstream`: Ts.ED connects to it
with the MCP client, discovers its tools, resources and prompts, and serves them on the endpoint over Streamable HTTP,
next to the tools declared locally. Use one `mcp` entry per upstream.

```typescript [src/Server.ts]
import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/platform-mcp";

@Configuration({
  mcp: [
    {
      path: "/mcp/directus",
      upstream: {
        type: "http",
        url: "https://directus.example.com/mcp",
        headers: {Authorization: `Bearer ${process.env.DIRECTUS_TOKEN}`}
      }
    },
    {
      path: "/mcp/files",
      upstream: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-filesystem", "/data"]
      }
    }
  ]
})
export class Server {}
```

| Option            | Description                                                                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`            | `"http"` (Streamable HTTP), `"sse"` (legacy SSE) or `"stdio"` (local process, e.g. started with `npx`).                                                        |
| `url`, `headers`  | Target and headers of an `http` or `sse` upstream.                                                                                                             |
| `command`, `args` | Command line of a `stdio` upstream. `env` and `cwd` are also accepted; `env` is merged over a safe subset of the parent environment.                           |
| `prefix`          | Optional prefix added to the exposed tool and prompt names. No prefix by default.                                                                              |
| `tools`           | `{include?, exclude?}` filters on upstream tool names (strings or regular expressions). `prompts` and `resources` (matched on the URI) accept the same filter. |
| `pool`            | `{max, idleTimeout}` bounds of the upstream connection pool (defaults: `100` connections, `300000` ms).                                                        |

Behavior to keep in mind:

- When a local declaration and an upstream entry resolve to the same name, the local declaration wins and the upstream
  entry is skipped with a warning. Use `prefix` to avoid collisions.
- An unreachable upstream does not break the endpoint: its entries are omitted, the error is logged, and the
  connection is retried later with a backoff.
- The connection is opened on first use and reused. The upstream catalog is cached and refreshed when the upstream
  sends a `list_changed` notification.
- Server-initiated requests from the upstream (sampling, elicitation, roots) and resource subscriptions are not
  forwarded.
- The CLI exposes the upstream in `streamable-http` mode only. It is ignored in `stdio` mode, and `${OAUTH_*}`
  placeholders are rejected because the CLI endpoint is not protected by OAuth.

## Protect an endpoint with OAuth <Badge text="v8.42.0+" />

Add an `auth` block to an MCP configuration to protect it with an OAuth 2.1 / OpenID Connect authorization server
(Keycloak, Auth0, Okta, Microsoft Entra ID, or any other compliant server). Ts.ED acts as an OAuth resource server only:
client registration (including Client ID Metadata Documents), authorization and consent are handled by the
authorization server.

`auth` is independent of `upstream`: it protects any MCP endpoint, whether it serves local tools, an upstream, or both.

```typescript [src/Server.ts]
import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/platform-mcp";
import {OrdersTool} from "./tools/OrdersTool.js";

@Configuration({
  mcp: {
    path: "/mcp",
    tools: [OrdersTool],
    auth: {
      // URL of the OIDC server, as published in its discovery document
      issuer: "https://auth.example.com",
      // public URL of this MCP endpoint
      resource: "https://api.example.com/mcp",
      scopesSupported: ["mcp:read", "mcp:write"],
      requiredScopes: ["mcp:read"],
      resourceName: "Orders MCP"
    }
  }
})
export class Server {}
```

### What the authorization server must provide

The configuration above works with any server that:

- publishes its metadata on `<issuer>/.well-known/openid-configuration` (or `/.well-known/oauth-authorization-server`),
  over HTTPS, with an `issuer` value identical to `auth.issuer`;
- lets MCP clients register, through Client ID Metadata Documents or Dynamic Client Registration;
- issues access tokens bound to the MCP endpoint: when the client sends `resource=https://api.example.com/mcp`
  ([RFC 8707](https://datatracker.ietf.org/doc/html/rfc8707)), the token `aud` must contain that URL;
- for the offline mode, issues JWT access tokens ([RFC 9068](https://datatracker.ietf.org/doc/html/rfc9068)) and exposes
  a `jwks_uri`; for the introspection mode, exposes an `introspection_endpoint` and a confidential client for the
  endpoint (see [Verify access tokens](#verify-access-tokens)).

### Check the setup

```bash
# 1. the endpoint challenges unauthenticated calls and points to its metadata
curl -i -X POST https://api.example.com/mcp \
  -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
# HTTP/1.1 401 Unauthorized
# WWW-Authenticate: Bearer error="invalid_token", ..., resource_metadata="https://api.example.com/.well-known/oauth-protected-resource/mcp"

# 2. the metadata names the authorization server
curl https://api.example.com/.well-known/oauth-protected-resource/mcp
# {"resource":"https://api.example.com/mcp","authorization_servers":["https://auth.example.com"],...}

# 3. a token issued by the authorization server for this resource is accepted
curl -X POST https://api.example.com/mcp \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

An MCP client performs steps 1 and 2 by itself, then runs the authorization flow against the authorization server and
retries with the token.

For each protected endpoint, Ts.ED:

- serves the [RFC 9728](https://datatracker.ietf.org/doc/html/rfc9728) protected resource metadata on
  `GET /.well-known/oauth-protected-resource<path>` (here `/.well-known/oauth-protected-resource/mcp`), listing
  `auth.issuer` as the authorization server;
- answers requests without a valid bearer token with `401` and a `WWW-Authenticate: Bearer resource_metadata="..."`
  challenge, and tokens lacking a required scope with `403 insufficient_scope`;
- exposes the verified identity to tool, resource and prompt handlers through `ctx.http.authInfo`.

Each entry of `mcp` has its own `auth` block, so different endpoints can rely on different authorization servers.

| Status | Meaning                                                                                             |
| ------ | --------------------------------------------------------------------------------------------------- |
| `401`  | Missing, expired or invalid token. The client must (re)authorize.                                   |
| `403`  | Valid token without one of `requiredScopes`.                                                        |
| `500`  | The authorization server (metadata, JWKS or introspection) could not be reached. Not a token issue. |

### Read the caller identity in a handler

The verified identity is available on the SDK context received by tool, resource and prompt handlers:

```typescript
import type {ServerContext} from "@modelcontextprotocol/server";
import {defineTool} from "@tsed/platform-mcp";
import {s} from "@tsed/schema";

export const whoAmI = defineTool({
  name: "who-am-i",
  description: "Returns the identity of the caller",
  inputSchema: s.object({}),
  handler(_args: unknown, ctx: ServerContext) {
    const authInfo = ctx.http?.authInfo;

    return {clientId: authInfo?.clientId, scopes: authInfo?.scopes, subject: authInfo?.extra?.sub};
  }
});
```

`authInfo.extra` holds the token claims (JWT payload or introspection response).

::: warning
`auth.resource` is required: it is the public URL of the MCP endpoint, as clients reach it. It is advertised in the
metadata and in the `401` challenge, and is the expected audience of access tokens. It is never derived from the
incoming request, whose `Host` header is controlled by the caller. Behind a proxy, use the external URL.
:::

### Verify access tokens

Tokens are verified against the configured `issuer`. Two built-in modes are available:

| Mode            | How it works                                                                                                                                                                     | Use it when                                                              |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `offline`       | The JWT access token ([RFC 9068](https://datatracker.ietf.org/doc/html/rfc9068), `typ: at+jwt`) is validated locally with the issuer JWKS, plus issuer, audience and expiration. | Access tokens are JWTs. No call to the authorization server per request. |
| `introspection` | The authorization server is asked for each token ([RFC 7662](https://datatracker.ietf.org/doc/html/rfc7662)).                                                                    | Access tokens are opaque, or revocation must apply immediately.          |

```typescript
// offline (default)
auth: {
  issuer: "https://auth.example.com",
  resource: "https://api.example.com/mcp/directus"
}

// introspection (default when clientId is set)
auth: {
  issuer: "https://auth.example.com",
  resource: "https://api.example.com/mcp/directus",
  clientId: "mcp-gateway",
  clientSecret: process.env.MCP_GATEWAY_SECRET
}
```

| Option                     | Description                                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `mode`                     | `"offline"` or `"introspection"`. Defaults to `introspection` when `clientId` is set, `offline` otherwise.     |
| `clientId`, `clientSecret` | Credentials of the MCP endpoint on the authorization server. Required by the introspection mode.               |
| `audience`                 | Expected audience of the tokens. Defaults to `resource`. `false` disables the check (introspection mode only). |
| `jwksUri`                  | JWKS URL for the offline mode. Discovered from the issuer metadata by default.                                 |
| `introspectionEndpoint`    | Introspection URL. Discovered from the issuer metadata by default.                                             |
| `cacheTtl`                 | Seconds an introspection result is reused. Defaults to `60`; `0` disables the cache.                           |
| `allowInsecureRequests`    | Allow a non-HTTPS issuer. For local development only.                                                          |

Both modes rely on [`oauth4webapi`](https://github.com/panva/oauth4webapi). The JWKS and introspection endpoints are discovered from `<issuer>/.well-known/openid-configuration` (then
`/.well-known/oauth-authorization-server`).

::: warning
The audience is checked in both modes: a token whose `aud` (JWT claim, or introspection response) does not contain the
endpoint `resource` is rejected, including when the authorization server returns no audience at all. The authorization
server has to issue tokens for the resource requested by the MCP client (resource indicators).

In introspection mode only, `audience: false` disables this check, for authorization servers that do not report an
audience. The endpoint then accepts any active token of the issuer, whatever the application it was issued for, and a
warning is logged at startup. The check cannot be disabled in offline mode.
:::

To replace the built-in modes, set `auth.verifier` to an object, or an injectable class, implementing
`verifyAccessToken(token)`. It returns the MCP `AuthInfo` of the caller (with a mandatory `expiresAt`, in seconds) and
throws when the token is not valid.

```typescript [src/services/SessionTokenVerifier.ts]
import type {AuthInfo, OAuthTokenVerifier} from "@modelcontextprotocol/server";
import {Injectable} from "@tsed/di";

@Injectable()
export class SessionTokenVerifier implements OAuthTokenVerifier {
  async verifyAccessToken(token: string): Promise<AuthInfo> {
    const session = await this.findSession(token);

    return {token, clientId: session.clientId, scopes: session.scopes, expiresAt: session.expiresAt};
  }
}
```

### Forward the caller identity to the upstream

The caller's token is never sent to the upstream implicitly. Reference it with a placeholder where the upstream expects
it: in `headers` for `http` and `sse` upstreams, in `args` and `env` for `stdio` upstreams.

| Placeholder          | Value                                       |
| -------------------- | ------------------------------------------- |
| `${OAUTH_TOKEN}`     | Verified access token of the caller.        |
| `${OAUTH_CLIENT_ID}` | Client identifier returned by the verifier. |
| `${OAUTH_SCOPES}`    | Scopes of the token, separated by a space.  |

```typescript
// HTTP: any header
upstream: {
  type: "http",
  url: "https://directus.example.com/mcp",
  headers: {"X-OIDC-Token": "${OAUTH_TOKEN}"}
}

// stdio: arguments or environment
upstream: {
  type: "stdio",
  command: "npx",
  args: ["-y", "some-mcp-server", "--token", "${OAUTH_TOKEN}"],
  env: {API_TOKEN: "${OAUTH_TOKEN}"}
}
```

::: tip
Placeholders are plain strings, not JavaScript template literals: write `"Bearer ${OAUTH_TOKEN}"` with regular quotes.
:::

Placeholders require `auth` on the endpoint; the application fails to start otherwise.

One upstream connection is kept per distinct set of interpolated values. For a `stdio` upstream this means **one
process per token**, bounded by `pool.max` and closed after `pool.idleTimeout`. Prefer `env` over `args` for secrets:
command-line arguments are visible to other users of the machine.

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
