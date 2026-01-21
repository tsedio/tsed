import {DITest, inject, Injectable} from "@tsed/di";
import {CollectionOf, Description, Property, Returns} from "@tsed/schema";

import {Tool} from "./tool.js";

class Model {
  @Property()
  public name: string;
}

class Item {
  @Property()
  public name: string;
}

class Output {
  @CollectionOf(Item)
  structuredContent: Item[];
}

@Injectable()
class TestTool {
  @Tool("test-tool")
  @Description("Test description")
  @Returns(200, Output)
  tool(input: Model) {
    return new Output();
  }

  @Tool()
  @Description("Test description")
  @Returns(200, Output)
  tool2(input: Model) {
    return new Output();
  }
}

describe("Tool", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  it("should returns metadata with name", () => {
    const tool = inject<any>(Symbol.for(`MCP:TOOL:test-tool`));

    expect(tool).toEqual({
      propertyKey: "tool",
      token: TestTool,
      name: "test-tool",
      description: "Test description",
      handler: expect.any(Function),
      inputSchema: expect.any(Object),
      outputSchema: expect.any(Object)
    });
  });
  it("should returns metadata with propertyKey as tool name", () => {
    const tool = inject<any>(Symbol.for(`MCP:TOOL:tool2`));

    expect(tool).toEqual({
      propertyKey: "tool2",
      token: TestTool,
      name: "tool2",
      description: "Test description",
      handler: expect.any(Function),
      inputSchema: expect.any(Object),
      outputSchema: expect.any(Object)
    });
  });
});
