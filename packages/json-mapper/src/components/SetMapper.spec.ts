import {expect} from "chai";
import * as Sinon from "sinon";
import {SetMapper} from "./SetMapper";

describe("SetMapper", () => {
  describe("deserialize()", () => {
    it("should return value", () => {
      const ctx = {
        type: String,
        collectionType: Set,
        next: Sinon.stub().callsFake(o => String("testMap"))
      };

      const mapper = new SetMapper();

      const value = mapper.deserialize(["test"], ctx);

      expect(value).to.be.instanceof(Set);
      expect(Array.from(value.values())).to.deep.eq(["testMap"]);
    });
  });
  describe("serialize()", () => {
    it("should return value", () => {
      const ctx = {
        type: String,
        collectionType: Set,
        next: Sinon.stub().callsFake(o => String("testMap"))
      };

      const arrayMapper = new SetMapper();

      const value = arrayMapper.serialize(new Set(["test"]), ctx);

      expect(value).to.deep.eq(["testMap"]);
    });
  });
});
