import {PlatformTest} from "@tsed/common";
import {expect} from "chai";

import {ParseService} from "./ParseService";

describe("ParseService", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  describe("eval()", () => {
    it("should evaluate expression with a scope and return value", () => {
      const service = PlatformTest.get<ParseService>(ParseService);
      expect(
        service.eval("test", {
          test: "yes"
        })
      ).to.equal("yes");
    });
  });
});
