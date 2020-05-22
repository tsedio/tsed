import {expect} from "chai";
import * as Sinon from "sinon";
import {ArrayMapper} from "./ArrayMapper";

describe("ArrayMapper", () => {
  describe("deserialize()", () => {
    it("should return value", () => {
      const ctx = {
        type: String,
        collectionType: Array,
        next: Sinon.stub().callsFake(o => String("testMap"))
      };

      const arrayMapper = new ArrayMapper();

      const value = arrayMapper.deserialize(["test"], ctx);

      expect(value).to.deep.eq(["testMap"]);
    });
  });
  describe("serialize()", () => {
    it("should return value", () => {
      const ctx = {
        type: String,
        collectionType: Array,
        next: Sinon.stub().callsFake(o => String("testMap"))
      };

      const arrayMapper = new ArrayMapper();

      const value = arrayMapper.serialize(["test"], ctx);

      expect(value).to.deep.eq(["testMap"]);
    });
  });
});
