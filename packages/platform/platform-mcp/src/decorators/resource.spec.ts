import {DITest, inject, Injectable} from "@tsed/di";
import {ContentType, Description, Title} from "@tsed/schema";

import {Resource} from "./resource.js";

@Injectable()
class TestResource {
  @Resource("tsed://init/options")
  @Title("Title")
  @Description("Description")
  @ContentType("application/json")
  resource() {}
}

describe("Resource", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  it("should returns metadata", () => {
    const tool = inject<any>(Symbol.for(`MCP:RESOURCE:resource`));

    expect(tool).toEqual({
      propertyKey: "resource",
      token: TestResource,
      name: "resource",
      title: "Title",
      template: undefined,
      description: "Description",
      uri: "tsed://init/options",
      handler: expect.any(Function)
    });
  });
});
