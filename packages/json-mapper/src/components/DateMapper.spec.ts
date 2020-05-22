import {expect} from "chai";
import {DateMapper} from "./DateMapper";

describe("DateMapper", () => {
  describe("deserialize()", () => {
    it("should return value", () => {
      const date = new Date();
      const mapper = new DateMapper();

      const value = mapper.deserialize(date.toISOString());

      expect(value).to.deep.eq(date);
    });
  });
  describe("serialize()", () => {
    it("should return value", () => {
      const date = new Date();
      const mapper = new DateMapper();

      const value = mapper.serialize(date);

      expect(value).to.deep.eq(date.toISOString());
    });
  });
});
