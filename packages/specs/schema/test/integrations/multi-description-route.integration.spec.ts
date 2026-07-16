import "../../src/index.js";
import {Name, Put, SpecTypes, getSpec} from "../../src/index.js";
import {Controller} from "@tsed/di";

@Controller("/")
class TestController {
  @(Put("/").Description("Update a pet"))
  @(Put("/:id").Description("Description with id"))
  @(Put("/:id/:albumToken").Description("Description with id and albumToken"))
  put() {
    return null;
  }
}

describe("Multi description", () => {
  describe("OpenSpec", () => {
    it("should generate the spec", () => {
      const spec = getSpec(TestController, {specType: SpecTypes.OPENAPI});

      expect(spec).toMatchSnapshot();
    });
  });
});
