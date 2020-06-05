import {PlatformTest} from "@tsed/common";
import {ParseService} from "./ParseService";

describe("ParseService", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  describe("eval()", () => {
    it("should evaluate expression with a scope and return value", PlatformTest.inject([ParseService], (parseService: ParseService) => {
      expect(parseService.eval("test", {
        test: "yes"
      })).toEqual("yes");
    }));
  });
});
