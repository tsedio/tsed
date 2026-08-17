import "../../src/http/index.js";
import "@tsed/ajv";
import {Configuration} from "@tsed/di";
import {functionalResource, functionalTool, genericTool} from "./functional.js";
import {TestPrompt} from "./prompts/TestPrompt.js";
import {TestResource} from "./resources/TestResource.js";
import {TestTool} from "./tools/TestTool.js";
import compress from "compression";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build
export {rootDir};

@Configuration({
  port: 8081,
  logger: {
    level: "info"
  },
  middlewares: ["cookie-parser", compress({}), "method-override", {use: "json-parser"}, {use: "urlencoded-parser"}],
  mcp: {
    prompts: [TestPrompt],
    resources: [TestResource, functionalResource],
    tools: [TestTool, functionalTool, genericTool]
  }
})
export class Server {}
