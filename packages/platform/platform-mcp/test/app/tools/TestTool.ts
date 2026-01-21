import type {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {Injectable} from "@tsed/di";
import {Description, Property, Returns, Title} from "@tsed/schema";

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
  @Returns(200, Output)
  async test(input: Input): Promise<CallToolResult> {
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
}
