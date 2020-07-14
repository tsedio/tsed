import {isParameterType} from "@tsed/schema";
import {expect} from "chai";

describe("JsonParameterType", () => {
  describe("isParameterType", () => {
    it("should return true", () => {
      expect(isParameterType("query")).to.eq(true);
    });
    it("should return false", () => {
      expect(isParameterType("req")).to.eq(false);
    });
  });
});
