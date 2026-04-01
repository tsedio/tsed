import type {ReadResourceResult} from "@modelcontextprotocol/sdk/types.js";
import {Description, Title} from "@tsed/schema";

import {Resource} from "../../../src/index.js";

export class TestResource {
  @Resource("tsed://resources/test")
  @Title("Test resource")
  @Description("Returns a static payload for integration tests")
  async test(uri: URL): Promise<ReadResourceResult> {
    return {
      contents: [
        {
          uri: uri.toString(),
          mimeType: "text/plain",
          text: "Hello from TestResource"
        }
      ]
    };
  }
}
