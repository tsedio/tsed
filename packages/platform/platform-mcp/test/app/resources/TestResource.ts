import {Description, Title} from "@tsed/schema";
import type {ReadResourceResult} from "@modelcontextprotocol/sdk/types.js";
import {Resource} from "../../../src/index.js";
import {Injectable} from "@tsed/di";

@Injectable()
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

  @Resource("tsed://resources/error")
  async error() {
    throw new Error("Resource failed");
  }

  @Resource("tsed://resources/serialized")
  async serialized() {
    return {
      message: "Hello from serialized resource"
    };
  }
}
