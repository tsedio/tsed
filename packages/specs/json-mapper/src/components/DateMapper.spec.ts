import {DateMapper} from "./DateMapper.js";

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

    it("should give the same string as toISOString()", () => {
      const mapper = new DateMapper();
      const dates = [
        new Date(0),
        new Date(Date.UTC(1000, 0, 1)),
        new Date(Date.UTC(9999, 11, 31, 23, 59, 59, 999)),
        new Date(Date.UTC(2024, 1, 29, 1, 2, 3, 4)),
        new Date(Date.UTC(2026, 9, 10, 12, 30, 45, 50))
      ];

      for (let time = -2e12; time < 4e12; time += 7777777777) {
        dates.push(new Date(time));
      }

      for (const date of dates) {
        expect(mapper.serialize(date)).toEqual(date.toISOString());
      }
    });

    it("should keep toISOString() outside the years 1000-9999", () => {
      const mapper = new DateMapper();

      expect(mapper.serialize(new Date(Date.UTC(999, 11, 31, 23, 59, 59, 999)))).toEqual("0999-12-31T23:59:59.999Z");
      expect(mapper.serialize(new Date(Date.UTC(10000, 0, 1)))).toEqual("+010000-01-01T00:00:00.000Z");
      expect(mapper.serialize(new Date(-8.64e15))).toEqual("-271821-04-20T00:00:00.000Z");
    });

    it("should read the real date of a subclass that overrides the UTC getters", () => {
      class OtherYear extends Date {
        getUTCFullYear() {
          return 2000;
        }
      }
      const mapper = new DateMapper();
      const date = new OtherYear(Date.UTC(2026, 0, 1));

      expect(mapper.serialize(date)).toEqual("2026-01-01T00:00:00.000Z");
    });

    it("should throw like toISOString() on an invalid date", () => {
      const mapper = new DateMapper();

      expect(() => mapper.serialize(new Date(NaN))).toThrow(RangeError);
    });

    it("should serialize a string or a number as a date", () => {
      const mapper = new DateMapper();

      expect(mapper.serialize("2026-01-01T00:00:00.000Z" as any)).toEqual("2026-01-01T00:00:00.000Z");
      expect(mapper.serialize(0 as any)).toEqual(0);
      expect(mapper.serialize(1 as any)).toEqual("1970-01-01T00:00:00.001Z");
    });
  });
});
