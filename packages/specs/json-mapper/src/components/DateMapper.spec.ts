import {expect} from "chai";
import {DateMapper} from "./DateMapper";

describe("DateMapper", () => {
  describe("deserialize()", () => {
    it("should return a Date when the data is a string", () => {
      const date = new Date();
      const mapper = new DateMapper();

      const value = mapper.deserialize(date.toISOString());

      expect(value).to.deep.eq(date);
    });

    it("should return a Date when the data is a number", () => {
      const date = new Date();
      const mapper = new DateMapper();

      const value = mapper.deserialize(date.getTime());

      expect(value).to.deep.eq(date);
    });

    it("should return value when the data is a boolean/null/undefined", () => {
      const date = new Date();
      const mapper = new DateMapper();

      expect(mapper.deserialize(false)).to.eq(false);
      expect(mapper.deserialize(true)).to.eq(true);
      expect(mapper.deserialize(null)).to.eq(null);
      expect(mapper.deserialize(undefined)).to.eq(undefined);
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
