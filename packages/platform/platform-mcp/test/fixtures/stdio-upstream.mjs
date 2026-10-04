import {McpServer} from "@modelcontextprotocol/server";
import {StdioServerTransport} from "@modelcontextprotocol/server/stdio";

const server = new McpServer({name: "stdio-upstream", version: "1.0.0"});

server.registerTool("stdio-ping", {description: "Ping served over stdio"}, () => ({
  content: [{type: "text", text: "pong from stdio"}]
}));

server.registerTool("stdio-args", {description: "Returns the arguments and environment of the process"}, () => ({
  content: [{type: "text", text: JSON.stringify({args: process.argv.slice(2), token: process.env.UPSTREAM_TOKEN})}]
}));

await server.connect(new StdioServerTransport());
