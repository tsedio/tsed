import {DITest, inject, Injectable} from "@tsed/di";
import {Description, Title} from "@tsed/schema";

import {Prompt} from "./prompt.js";

@Injectable()
class TestPrompt {
  @Prompt()
  @Title("Title")
  @Description("Description")
  prompt() {}
}

describe("Prompt", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  it("should returns metadata without explicit given options", () => {
    const tool = inject<any>(Symbol.for(`MCP:PROMPT:prompt`));

    expect(tool).toEqual({
      propertyKey: "prompt",
      token: TestPrompt,
      name: "prompt",
      title: "Title",
      description: "Description",
      handler: expect.any(Function)
    });
  });
});
