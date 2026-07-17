import {Description, Property, Returns, Title} from "@tsed/schema";
import type {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {Injectable} from "@tsed/di";
import {Tool} from "../../../src/index.js";

class Input {
  @Property()
  id: string;
}

class Output {
  @Property()
  hello: string;
}

@Injectable()
export class TestTool {
  @Tool("test-tool")
  @Title("Test tool")
  @Description("Test description")
  @Returns(Output)
  async test(input: Input): Promise<CallToolResult> {
    if (input.id === "error") {
      throw new Error("Tool failed");
    }

    return {
      content: [
        {
          type: "text",
          text: `Processed tool invocation for ${input.id}`
        }
      ],
      structuredContent: {
        hello: "world"
      }
    };
  }

  @Tool("serialized-tool")
  @Returns(Output)
  async serialized(): Promise<Output> {
    return {hello: "serialized"};
  }
}
