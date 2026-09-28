import type {McpServer} from "@modelcontextprotocol/server";
import {logger} from "@tsed/di";

export async function mcpStreamableServer(createServer: () => McpServer) {
  const {NodeStreamableHTTPServerTransport} = await import("@modelcontextprotocol/node");
  // @ts-ignore
  const {default: express} = await import("express");

  const app = express();
  app.use(express.json());

  app.post("/mcp", async (req: any, res: any) => {
    const server = createServer();
    const transport = new NodeStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true
    });
    let closed = false;

    const closeServer = async () => {
      if (closed) {
        return;
      }

      closed = true;
      await server.close();
    };

    res.on("close", closeServer);

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } finally {
      res.off?.("close", closeServer);
      await closeServer();
    }
  });

  const port = parseInt(process.env.PORT || "3000");

  return new Promise((resolve, reject) => {
    app
      .listen(port, () => {
        logger().info({
          event: "MCP_STREAMABLE_SERVER",
          state: "OK",
          message: `Running http://localhost:${port}/mcp`
        });
      })
      .on("close", () => resolve(true))
      .on("error", (error: any) => {
        logger().error({
          event: "MCP_STREAMABLE_SERVER",
          state: "KO",
          message: error.message
        });
        reject(error);
      });
  });
}
