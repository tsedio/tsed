import Sinon from "sinon";
import {JsonMapperContext} from "../domain/JsonMapperContext";
import {SetMapper} from "./SetMapper";

describe("SetMapper", () => {
  describe("deserialize()", () => {
    it("should return value", () => {
      const ctx = new JsonMapperContext({
        type: String,
        collectionType: Set,
        next: Sinon.stub().callsFake((o) => String("testMap")),
        options: {}
      });

      const mapper = new SetMapper();

      const value = mapper.deserialize(["test"], ctx);

      expect(value).toBeInstanceOf(Set);
      expect(Array.from(value.values())).toEqual(["testMap"]);
    });
  });
  describe("serialize()", () => {
    it("should return value", () => {
      const ctx = {
        type: String,
        collectionType: Set,
        next: Sinon.stub().callsFake((o) => String("testMap"))
      };

      const arrayMapper = new SetMapper();

      const value = arrayMapper.serialize(new Set(["test"]), ctx);

      expect(value).toEqual(["testMap"]);
    });
  });
});
