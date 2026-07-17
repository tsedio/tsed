import {defineResource, defineTool} from "../../src/index.js";
import {Generics, Property, s} from "@tsed/schema";

@Generics("T")
class MyBaseModel<T> {
  @Property("T")
  data: T;
}

class MyData {
  @Property()
  id: string;
}

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

export const genericTool = defineTool({
  name: "generic-tool",
  outputSchema: s.generic(MyBaseModel).of(MyData),
  handler() {
    return {
      data: {
        id: "generic-data"
      }
    };
  }
});
