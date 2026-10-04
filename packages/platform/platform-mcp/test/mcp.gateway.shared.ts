import {join} from "node:path";
import type {AuthInfo, ServerContext} from "@modelcontextprotocol/server";
import {s} from "@tsed/schema";
import {defineTool} from "../src/common/index.js";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import SuperTest from "supertest";
import {rootDir, Server} from "./app/Server.js";
import {TestTool} from "./app/tools/TestTool.js";
import {startUpstreamHttpServer} from "./fixtures/upstream.js";

const verifier = {
  async verifyAccessToken(token: string): Promise<AuthInfo> {
    if (!token.startsWith("valid")) {
      throw new Error("Unknown token");
    }

    return {
      token,
      clientId: "client",
      scopes: token === "valid-read" ? ["mcp:read"] : ["mcp:read", "mcp:write"],
      expiresAt: Math.floor(Date.now() / 1000) + 3600
    };
  }
};

const auth = {
  issuer: "https://auth.example.com",
  verifier,
  scopesSupported: ["mcp:read", "mcp:write"],
  requiredScopes: ["mcp:write"],
  resourceName: "Secured gateway"
};

const whoAmI = defineTool({
  name: "who-am-i",
  description: "Returns the identity of the caller",
  inputSchema: s.object({}),
  handler(_args: unknown, ctx: ServerContext) {
    const authInfo = ctx.http?.authInfo;

    return {clientId: authInfo?.clientId, scopes: authInfo?.scopes};
  }
});

const stdioServer = join(rootDir, "../fixtures/stdio-upstream.mjs");

function send(path: string, method: string, params: Record<string, unknown> = {}, token?: string) {
  return SuperTest(PlatformTest.callback())
    .post(path)
    .set({
      Accept: "application/json,text/event-stream",
      "Content-Type": "application/json",
      ...(token && {Authorization: `Bearer ${token}`})
    })
    .send({jsonrpc: "2.0", id: 1, method, params});
}

export function describeMcpGateway(name: string, adapter: unknown) {
  const utils = PlatformTestSdk.create({
    rootDir,
    adapter: adapter as any,
    server: Server,
    logger: {
      level: "off"
    }
  });

  describe(`MCP gateway with ${name}`, () => {
    let upstream: Awaited<ReturnType<typeof startUpstreamHttpServer>>;

    beforeAll(async () => {
      upstream = await startUpstreamHttpServer();

      await utils.bootstrap({
        mcp: [
          {
            path: "/mcp/gateway",
            tools: [TestTool],
            upstream: {type: "http", url: upstream.url, headers: {"x-api-key": "secret"}}
          },
          {
            path: "/mcp/stdio",
            upstream: {type: "stdio", command: process.execPath, args: [stdioServer]}
          },
          {
            path: "/mcp/down",
            tools: [TestTool],
            upstream: {type: "http", url: "http://127.0.0.1:1/mcp"}
          },
          {
            path: "/mcp/prefixed",
            upstream: {
              type: "http",
              url: upstream.url,
              prefix: "up_",
              tools: {exclude: ["fail", /^test-/]},
              prompts: {include: []}
            }
          },
          {
            path: "/mcp/secured",
            auth,
            tools: [whoAmI],
            upstream: {type: "http", url: upstream.url, headers: {"X-OIDC-Token": "${OAUTH_TOKEN}"}}
          },
          {
            path: "/mcp/secured-stdio",
            auth,
            upstream: {
              type: "stdio",
              command: process.execPath,
              args: [stdioServer, "--token", "${OAUTH_TOKEN}"],
              env: {UPSTREAM_TOKEN: "${OAUTH_TOKEN}"}
            }
          }
        ]
      })();
    });

    afterAll(async () => {
      await utils.reset();
      await upstream.close();
    });

    describe("proxy", () => {
      it("lists local tools and the tools of the upstream", async () => {
        const {body} = await send("/mcp/gateway", "tools/list");
        const names = body.result.tools.map(({name}: {name: string}) => name);

        expect(names).toEqual(expect.arrayContaining(["echo", "fail", "test-tool"]));
        expect(names.filter((name: string) => name === "test-tool")).toHaveLength(1);
        expect(body.result.tools.find(({name}: {name: string}) => name === "echo")).toMatchObject({
          description: "Echo the given message",
          inputSchema: {type: "object", properties: {message: {type: "string"}}, required: ["message"]}
        });
      });

      it("keeps the local tool when an upstream exposes the same name", async () => {
        const {body} = await send("/mcp/gateway", "tools/call", {name: "test-tool", arguments: {id: "123"}});

        expect(body.result.structuredContent).toEqual({hello: "world"});
      });

      it("forwards tool calls to an HTTP upstream with its static headers", async () => {
        const {body} = await send("/mcp/gateway", "tools/call", {name: "echo", arguments: {message: "hi"}});

        expect(body.result).toEqual({content: [{type: "text", text: "upstream:hi"}]});
        expect(upstream.requests.at(-1)).toMatchObject({"x-api-key": "secret"});
      });

      it("forwards tool calls to a stdio upstream", async () => {
        const {body} = await send("/mcp/stdio", "tools/call", {name: "stdio-ping", arguments: {}});

        expect(body.result).toEqual({content: [{type: "text", text: "pong from stdio"}]});
      });

      it("keeps serving local tools when the upstream is unreachable", async () => {
        const list = await send("/mcp/down", "tools/list");
        const call = await send("/mcp/down", "tools/call", {name: "test-tool", arguments: {id: "123"}});

        expect(list.body.result.tools.map(({name}: {name: string}) => name)).not.toContain("echo");
        expect(call.body.result.structuredContent).toEqual({hello: "world"});
      });

      it("preserves upstream tool errors", async () => {
        const {body} = await send("/mcp/gateway", "tools/call", {name: "fail", arguments: {}});

        expect(body.result).toEqual({isError: true, content: [{type: "text", text: "upstream failure"}]});
      });

      it("forwards resources and resource templates", async () => {
        const list = await send("/mcp/gateway", "resources/list");
        const read = await send("/mcp/gateway", "resources/read", {uri: "upstream://readme"});
        const template = await send("/mcp/gateway", "resources/read", {uri: "upstream://docs/42"});

        expect(list.body.result.resources).toEqual([{name: "readme", uri: "upstream://readme", mimeType: "text/plain"}]);
        expect(read.body.result.contents).toEqual([{uri: "upstream://readme", mimeType: "text/plain", text: "upstream readme"}]);
        expect(template.body.result.contents).toEqual([{uri: "upstream://docs/42", mimeType: "text/plain", text: "doc 42"}]);
      });

      it("forwards prompts with their arguments", async () => {
        const list = await send("/mcp/gateway", "prompts/list");
        const get = await send("/mcp/gateway", "prompts/get", {name: "greet", arguments: {who: "Ts.ED"}});

        expect(list.body.result.prompts).toEqual([
          {name: "greet", description: "Greet someone", arguments: [{name: "who", description: "Name", required: true}]}
        ]);
        expect(get.body.result.messages).toEqual([{role: "user", content: {type: "text", text: "Hello Ts.ED"}}]);
      });

      it("reuses the upstream connection across requests", async () => {
        await send("/mcp/gateway", "tools/list");

        const count = upstream.requests.length;

        await send("/mcp/gateway", "tools/list");

        expect(upstream.requests.length).toBe(count);
      });

      it("applies the prefix and the filters", async () => {
        const tools = await send("/mcp/prefixed", "tools/list");
        const prompts = await send("/mcp/prefixed", "prompts/list");
        const call = await send("/mcp/prefixed", "tools/call", {name: "up_echo", arguments: {message: "hi"}});

        expect(tools.body.result.tools.map(({name}: {name: string}) => name)).toEqual(["up_echo"]);
        expect(prompts.body.result?.prompts || []).toEqual([]);
        expect(call.body.result).toEqual({content: [{type: "text", text: "upstream:hi"}]});
      });
    });

    describe("auth", () => {
      it("serves the protected resource metadata of the endpoint", async () => {
        const response = await SuperTest(PlatformTest.callback()).get("/.well-known/oauth-protected-resource/mcp/secured");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          resource: expect.stringMatching(/^http:\/\/127\.0\.0\.1:\d+\/mcp\/secured$/),
          authorization_servers: ["https://auth.example.com"],
          bearer_methods_supported: ["header"],
          scopes_supported: ["mcp:read", "mcp:write"],
          resource_name: "Secured gateway"
        });
      });

      it("does not serve metadata for unprotected endpoints", async () => {
        const response = await SuperTest(PlatformTest.callback()).get("/.well-known/oauth-protected-resource/mcp/gateway");

        expect(response.status).toBe(404);
      });

      it("challenges requests without a token", async () => {
        const response = await send("/mcp/secured", "tools/list");

        expect(response.status).toBe(401);
        expect(response.headers["www-authenticate"]).toMatch(
          /^Bearer .*resource_metadata="http:\/\/127\.0\.0\.1:\d+\/\.well-known\/oauth-protected-resource\/mcp\/secured"/
        );
      });

      it("challenges requests with an invalid token", async () => {
        const response = await send("/mcp/secured", "tools/list", {}, "nope");

        expect(response.status).toBe(401);
        expect(response.headers["www-authenticate"]).toContain('error="invalid_token"');
      });

      it("rejects tokens without the required scope", async () => {
        const response = await send("/mcp/secured", "tools/list", {}, "valid-read");

        expect(response.status).toBe(403);
        expect(response.headers["www-authenticate"]).toContain('error="insufficient_scope"');
        expect(response.headers["www-authenticate"]).toContain('scope="mcp:write"');
      });

      it("interpolates the verified token in the upstream headers", async () => {
        const {status, body} = await send("/mcp/secured", "tools/call", {name: "echo", arguments: {message: "hi"}}, "valid");

        expect(status).toBe(200);
        expect(body.result).toEqual({content: [{type: "text", text: "upstream:hi"}]});
        expect(upstream.requests.at(-1)).toMatchObject({"x-oidc-token": "valid"});
        expect(upstream.requests.at(-1)).not.toHaveProperty("authorization");
      });

      it("exposes the verified identity to local handlers", async () => {
        const {body} = await send("/mcp/secured", "tools/call", {name: "who-am-i", arguments: {}}, "valid");

        expect(body.result.structuredContent).toEqual({clientId: "client", scopes: ["mcp:read", "mcp:write"]});
      });

      it("interpolates the verified token in the stdio arguments and environment", async () => {
        const first = await send("/mcp/secured-stdio", "tools/call", {name: "stdio-args", arguments: {}}, "valid");
        const second = await send("/mcp/secured-stdio", "tools/call", {name: "stdio-args", arguments: {}}, "valid-other");

        expect(JSON.parse(first.body.result.content[0].text)).toEqual({args: ["--token", "valid"], token: "valid"});
        expect(JSON.parse(second.body.result.content[0].text)).toEqual({args: ["--token", "valid-other"], token: "valid-other"});
      });
    });
  });
}
