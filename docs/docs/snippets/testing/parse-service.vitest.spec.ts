import {it, expect, describe, beforeEach, afterEach} from "vitest";
import {PlatformTest} from "@tsed/platform-http/testing";
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
      ).toEqual("yes");
    });
  });
});
