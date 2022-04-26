import Sinon from "sinon";
import {JsonMapperContext} from "../domain/JsonMapperContext";
import {MapMapper} from "./MapMapper";

describe("MapMapper", () => {
  describe("deserialize()", () => {
    it("should return value", () => {
      const ctx = new JsonMapperContext({
        type: String,
        collectionType: Map,
        next: Sinon.stub().callsFake((o) => String("testMap")),
        options: {}
      });

      const mapper = new MapMapper();

      const value = mapper.deserialize(
        {
          test: "test"
        },
        ctx
      );

      expect(value).toBeInstanceOf(Map);
      expect(value.get("test")).toEqual("testMap");
    });
  });
  describe("serialize()", () => {
    it("should return value", () => {
      const ctx = {
        type: String,
        collectionType: Array,
        next: Sinon.stub().callsFake((o) => String("testMap"))
      };

      const mapper = new MapMapper();

      const map = new Map();
      map.set("test", "test");

      const value = mapper.serialize(map, ctx);

      expect(value).toEqual({test: "testMap"});
    });
  });
});
