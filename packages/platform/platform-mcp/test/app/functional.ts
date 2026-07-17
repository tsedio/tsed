import {defineResource, defineTool} from "../../src/index.js";
import {s} from "@tsed/schema";

export const functionalResource = defineResource({
  name: "functional-resource",
  uri: "tsed://resources/functional",
  handler() {
    return {
      message: "Hello from functional resource"
    };
  }
});

export const functionalTool = defineTool({
  name: "functional-tool",
  inputSchema: s.object({
    value: s.string().required()
  }),
  outputSchema: s.object({
    message: s.string().required()
  }),
  handler({value}) {
    return {
      message: `Hello ${value}`
    };
  }
});
