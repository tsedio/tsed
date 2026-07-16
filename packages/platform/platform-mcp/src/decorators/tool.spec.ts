import {CollectionOf, Default, Description, Name, Property, Returns} from "@tsed/schema";
import {DITest, Injectable, inject} from "@tsed/di";
import {Tool} from "./tool.js";

class Model {
  @Property()
  public name: string;
}

class AliasedModel {
  @Default(10)
  @Name("top_k")
  @Property()
  topK: number = 10;

  @Name("request_id")
  @Property()
  requestId?: string;
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
  public input?: AliasedModel;

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

  @Tool("deserialized-tool")
  @Description("Test description")
  @Returns(200, Output)
  tool3(input: AliasedModel) {
    this.input = input;

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

  it("should deserialize tool input from decorator metadata", async () => {
    const tool = inject<any>(Symbol.for(`MCP:TOOL:deserialized-tool`));
    const service = inject(TestTool);

    await tool.handler(
      {
        top_k: 12,
        request_id: "req-123"
      },
      {} as any
    );

    expect(service.input).toBeInstanceOf(AliasedModel);
    expect(service.input).toMatchObject({
      topK: 12,
      requestId: "req-123"
    });
  });
});
