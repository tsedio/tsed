import {DateMapper} from "./DateMapper";

describe("DateMapper", () => {
  describe("deserialize()", () => {
    it("should return a Date when the data is a string", () => {
      const date = new Date();
      const mapper = new DateMapper();

      const value = mapper.deserialize(date.toISOString());

      expect(value).toEqual(date);
    });

    it("should return a Date when the data is a number", () => {
      const date = new Date();
      const mapper = new DateMapper();

      const value = mapper.deserialize(date.getTime());

      expect(value).toEqual(date);
    });

    it("should return value when the data is a boolean/null/undefined", () => {
      const date = new Date();
      const mapper = new DateMapper();

      expect(mapper.deserialize(false)).toEqual(false);
      expect(mapper.deserialize(true)).toEqual(true);
      expect(mapper.deserialize(null)).toEqual(null);
      expect(mapper.deserialize(undefined)).toBeUndefined();
    });
  });
  describe("serialize()", () => {
    it("should return value", () => {
      const date = new Date();
      const mapper = new DateMapper();

      const value = mapper.serialize(date);

      expect(value).toEqual(date.toISOString());
    });
  });
});
