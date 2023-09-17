import {deserialize} from "./deserialize";

describe("deserialize()", () => {
  describe("Primitive", () => {
    it("should convert value", () => {
      expect(deserialize(null)).toEqual(null);
      expect(deserialize(null, {type: String})).toEqual(null);
      expect(deserialize(undefined)).toBeUndefined();
      expect(deserialize(false)).toEqual(false);
      expect(deserialize(true)).toEqual(true);
      expect(deserialize(0)).toEqual(0);
      expect(deserialize(1)).toEqual(1);
      expect(deserialize("")).toEqual("");
      expect(deserialize("1")).toEqual("1");

      expect(deserialize(null, {type: Boolean})).toEqual(null);
      expect(deserialize(undefined, {type: Boolean})).toBeUndefined();
      expect(deserialize(null, {type: Boolean})).toEqual(null);
      expect(deserialize(undefined, {type: Boolean})).toBeUndefined();
      expect(deserialize(false, {type: Boolean})).toEqual(false);
      expect(deserialize(true, {type: Boolean})).toEqual(true);
      expect(deserialize(0, {type: Number})).toEqual(0);
      expect(deserialize(1, {type: Number})).toEqual(1);
      expect(deserialize("", {type: Number})).toEqual(0);
      expect(deserialize("0", {type: Number})).toEqual(0);
      expect(deserialize("1", {type: Number})).toEqual(1);
      expect(deserialize("", {type: String})).toEqual("");
      expect(deserialize("0", {type: String})).toEqual("0");
      expect(deserialize("1", {type: String})).toEqual("1");
      expect(deserialize(["1"], {type: String})).toEqual(["1"]);
    });
  });
});
