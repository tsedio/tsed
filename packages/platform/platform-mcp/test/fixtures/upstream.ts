import {createServer, type IncomingHttpHeaders, type Server} from "node:http";
import type {AddressInfo} from "node:net";
import {NodeStreamableHTTPServerTransport} from "@modelcontextprotocol/node";
import {fromJsonSchema, McpServer, ResourceTemplate} from "@modelcontextprotocol/server";

export function createUpstreamMcpServer(name = "upstream") {
  const server = new McpServer({name, version: "1.0.0"});

  server.registerTool(
    "echo",
    {
      description: "Echo the given message",
      inputSchema: fromJsonSchema<{message: string}>({
        type: "object",
        properties: {message: {type: "string"}},
        required: ["message"]
      })
    },
    ({message}) => ({content: [{type: "text", text: `${name}:${message}`}]})
  );

  server.registerTool("fail", {description: "Always fails"}, () => ({
    isError: true,
    content: [{type: "text", text: "upstream failure"}]
  }));

  server.registerTool("test-tool", {description: "Collides with a local tool"}, () => ({
    content: [{type: "text", text: "from upstream"}]
  }));

  server.registerResource("readme", "upstream://readme", {mimeType: "text/plain"}, (uri) => ({
    contents: [{uri: uri.href, mimeType: "text/plain", text: "upstream readme"}]
  }));

  server.registerResource("doc", new ResourceTemplate("upstream://docs/{id}", {list: undefined}), {}, (uri, {id}) => ({
    contents: [{uri: uri.href, mimeType: "text/plain", text: `doc ${id}`}]
  }));

  server.registerPrompt(
    "greet",
    {
      description: "Greet someone",
      argsSchema: fromJsonSchema<{who: string}>({
        type: "object",
        properties: {who: {type: "string", description: "Name"}},
        required: ["who"]
      })
    },
    ({who}) => ({messages: [{role: "user", content: {type: "text", text: `Hello ${who}`}}]})
  );

  return server;
}

/**
 * Starts a stateless Streamable HTTP MCP server recording the headers it receives.
 */
export async function startUpstreamHttpServer() {
  const requests: IncomingHttpHeaders[] = [];

  const http: Server = createServer(async (req, res) => {
    requests.push(req.headers);

    if (req.method !== "POST") {
      res.writeHead(405).end();
      return;
    }

    const server = createUpstreamMcpServer();
    const transport = new NodeStreamableHTTPServerTransport({sessionIdGenerator: undefined, enableJsonResponse: true});

    res.once("close", () => server.close());

    await server.connect(transport as never);
    await transport.handleRequest(req, res);
  });

  await new Promise<void>((resolve) => http.listen(0, "127.0.0.1", resolve));

  return {
    requests,
    url: `http://127.0.0.1:${(http.address() as AddressInfo).port}/mcp`,
    close: () => new Promise((resolve) => http.close(resolve))
  };
}
