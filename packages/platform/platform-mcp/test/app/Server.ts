import "@tsed/ajv";
import "../../src/index.js";

import {Configuration} from "@tsed/di";
import compress from "compression";

import {TestPrompt} from "./prompts/TestPrompt.js";
import {TestResource} from "./resources/TestResource.js";
import {TestTool} from "./tools/TestTool.js";

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
    resources: [TestResource],
    tools: [TestTool]
  }
})
export class Server {}
