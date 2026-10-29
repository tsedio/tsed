import "../components/PrimitiveMapper.js";
import {AdditionalProperties, Name, Property} from "@tsed/schema";
import {JsonDeserializer} from "./JsonDeserializer.js";
import {JsonMapperSettings} from "./JsonMapperSettings.js";
import {JsonSerializer} from "./JsonSerializer.js";

class Model {
  @Property()
  id: string;

  @Name("label")
  name: string;
}

class Empty {}

@AdditionalProperties(true)
class OpenModel {
  @Property()
  id: string;

  @Name("label")
  name: string;
}

describe("JsonMapper: additional properties", () => {
  describe("deserialize, additionalProperties option", () => {
    it("should copy the unknown keys only, without overwriting the declared properties", () => {
      const input = JSON.parse(
        '{"id": "1", "label": "a", "name": "ignored", "extra": 1, "constructor": 2, "__proto__": {"polluted": true}}'
      );

      const result = new JsonDeserializer().map(input, {type: Model, additionalProperties: true});

      expect(result).toBeInstanceOf(Model);
      expect({...result}).toEqual({id: "1", name: "a", extra: 1});
      expect(Object.hasOwn(result, "constructor")).toBe(false);
      expect(Object.hasOwn(result, "__proto__")).toBe(false);
      expect(Object.getPrototypeOf(result)).toBe(Model.prototype);
      expect(({} as any).polluted).toBeUndefined();
    });

    it("should not copy the unknown keys when the option is disabled", () => {
      const result = new JsonDeserializer().map({id: "1", label: "a", extra: 1}, {type: Model, additionalProperties: false});

      expect({...result}).toEqual({id: "1", name: "a"});
    });

    it("should follow the global setting when the option is not given", () => {
      const deserializer = new JsonDeserializer();

      JsonMapperSettings.additionalProperties = true;

      try {
        expect({...deserializer.map({id: "1", extra: 1}, {type: Model})}).toEqual({id: "1", extra: 1});
      } finally {
        JsonMapperSettings.additionalProperties = false;
      }

      expect({...deserializer.map({id: "1", extra: 1}, {type: Model})}).toEqual({id: "1"});
    });

    it("should copy every key of a model without properties when the option is enabled", () => {
      const deserializer = new JsonDeserializer();

      expect({...deserializer.map({a: 1, b: "2"}, {type: Empty, additionalProperties: true})}).toEqual({a: 1, b: "2"});
      expect({...deserializer.map({a: 1, b: "2"}, {type: Empty, additionalProperties: false})}).toEqual({});
    });

    it("should map the items of a collection with the option", () => {
      const result = new JsonDeserializer().map([{id: "1", extra: 1}, {id: "2"}], {
        type: Model,
        collectionType: Array,
        additionalProperties: true
      });

      expect(result.map((item: any) => ({...item}))).toEqual([{id: "1", extra: 1}, {id: "2"}]);
    });
  });

  describe("@AdditionalProperties(true)", () => {
    it("should deserialize the unknown keys, but not the declared ones", () => {
      const result = new JsonDeserializer().map({id: "1", label: "a", extra: 1}, {type: OpenModel});

      expect({...result}).toEqual({id: "1", name: "a", extra: 1});
    });

    it("should serialize the unknown keys, but not the declared ones", () => {
      const model = Object.assign(new OpenModel(), {id: "1", name: "a", extra: 1, other: {deep: true}});

      const result = new JsonSerializer().map(model);

      expect(result).toEqual({id: "1", label: "a", extra: 1, other: {deep: true}});
      expect(Object.keys(result)).toEqual(["id", "label", "extra", "other"]);
    });
  });
});
