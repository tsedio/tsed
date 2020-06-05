import {PlatformTest} from "@tsed/common";
import {TestContext} from "@tsed/testing";
import {expect} from "chai";
import {ParseService} from "./ParseService";

describe("ParseService", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  describe("eval()", () => {
    it("should evaluate expression with a scope and return value", PlatformTest.inject([ParseService], (parseService: ParseService) => {
      expect(parseService.eval("test", {
        test: "yes"
      })).to.equal("yes");
    }));
  });
});
