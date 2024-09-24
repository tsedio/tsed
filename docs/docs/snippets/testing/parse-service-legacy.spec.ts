import {inject, TestContext} from "@tsed/testing";
import {expect} from "chai";

import {ParseService} from "./ParseService";

describe("ParseService", () => {
  before(TestContext.create);
  after(TestContext.reset);
  describe("eval()", () => {
    it("should evaluate expression with a scope and return value", inject([ParseService], (parseService: ParseService) => {
      expect(
        parseService.eval("test", {
          test: "yes"
        })
      ).to.equal("yes");
    }));
  });
});
