import {Injectable} from "@tsed/di";
import {Description, Title} from "@tsed/schema";

import {Prompt} from "../../../src/index.js";

@Injectable()
class TestPrompt {
  @Prompt()
  @Title("Title")
  @Description("Description")
  prompt() {
    return {
      description: "Integration prompt response",
      messages: [
        {
          role: "assistant",
          content: [
            {
              type: "text",
              text: "Use @tsed/platform-mcp to interact with tools and resources."
            }
          ]
        }
      ]
    };
  }
}
