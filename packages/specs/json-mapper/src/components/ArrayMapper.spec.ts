import Sinon from "sinon";
import {JsonMapperContext} from "../domain/JsonMapperContext";
import {ArrayMapper} from "./ArrayMapper";

describe("ArrayMapper", () => {
  describe("deserialize()", () => {
    it("should return value", () => {
      const ctx = new JsonMapperContext({
        type: String,
        collectionType: Array,
        next: Sinon.stub().callsFake((o) => String("testMap")),
        options: {}
      });

      const arrayMapper = new ArrayMapper();

      const value = arrayMapper.deserialize(["test"], ctx);

      expect(value).toEqual(["testMap"]);
    });
  });
  describe("serialize()", () => {
    it("should return value", () => {
      const ctx = new JsonMapperContext({
        type: String,
        collectionType: Array,
        next: Sinon.stub().callsFake((o) => String("testMap")),
        options: {}
      });

      const arrayMapper = new ArrayMapper();

      const value = arrayMapper.serialize(["test"], ctx);

      expect(value).toEqual(["testMap"]);
    });
  });
});
