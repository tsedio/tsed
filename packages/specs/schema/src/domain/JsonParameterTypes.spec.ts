import {isParameterType} from "../index";

describe("JsonParameterType", () => {
  describe("isParameterType", () => {
    it("should return true", () => {
      expect(isParameterType("query")).toBe(true);
    });
    it("should return false", () => {
      expect(isParameterType("req")).toBe(false);
    });
  });
});
