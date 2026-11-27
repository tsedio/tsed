import "../components/DateMapper.js";
import "../components/PrimitiveMapper.js";
import {AdditionalProperties, Groups, Ignore, Name, Property} from "@tsed/schema";
import {OnDeserialize} from "../decorators/onDeserialize.js";
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

@AdditionalProperties(true)
class InitializedModel {
  @Name("label")
  name: string = "default";

  @Name("created_at")
  createdAt: Date;
}

@AdditionalProperties(true)
class ProtectedModel {
  @Name("is_admin")
  @Ignore()
  isAdmin: boolean = false;

  @Name("role_id")
  @Groups("!creation")
  roleId: string = "user";
}

@AdditionalProperties(true)
class IgnoreCallbackModel {
  @Name("secret_key")
  @Ignore(() => true)
  secret: string = "hidden";

  @Name("public_key")
  @Ignore(() => false)
  open: string;
}

@AdditionalProperties(true)
class HookModel {
  @Name("label")
  @OnDeserialize((value) => (value === undefined ? "computed" : value))
  name: string;

  @Name("code")
  @OnDeserialize(() => undefined)
  skipped: string;
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

    it("should read the declared name of an aliased property when the input has no alias", () => {
      const result = new JsonDeserializer().map({id: "1", name: "fallback", extra: 1}, {type: Model, additionalProperties: true});

      expect({...result}).toEqual({id: "1", name: "fallback", extra: 1});
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

    it("should not overwrite an aliased property with a key named like the property", () => {
      const deserializer = new JsonDeserializer();

      expect({...deserializer.map({id: "1", label: "a", name: "ignored", extra: 1}, {type: OpenModel})}).toEqual({
        id: "1",
        name: "a",
        extra: 1
      });
      // the declared name stays a fallback when the input has no alias
      expect({...deserializer.map({id: "1", name: "fallback", extra: 1}, {type: OpenModel})}).toEqual({
        id: "1",
        name: "fallback",
        extra: 1
      });
    });

    it("should read the declared name of an aliased property over its field initializer", () => {
      const deserializer = new JsonDeserializer();

      expect(deserializer.map({name: "provided"}, {type: InitializedModel}).name).toEqual("provided");
      expect(deserializer.map({label: "a", name: "ignored"}, {type: InitializedModel}).name).toEqual("a");
      expect(deserializer.map({}, {type: InitializedModel}).name).toEqual("default");
    });

    it("should keep the value mapped from the declared name when the alias is not used", () => {
      const result = new JsonDeserializer().map(
        {label: "ignored", name: "a", createdAt: "2020-01-01T00:00:00.000Z"},
        {type: InitializedModel, useAlias: false}
      );

      expect(result.name).toEqual("a");
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it("should not fill an excluded aliased property from its declared name", () => {
      const deserializer = new JsonDeserializer();

      const result = deserializer.map({isAdmin: true, roleId: "admin", extra: 1}, {type: ProtectedModel, groups: ["creation"]});

      expect(result.isAdmin).toBe(false);
      expect(result.roleId).toEqual("user");
      expect(result.extra).toEqual(1);
    });

    it("should not fill a property ignored by a callback from its declared name", () => {
      const deserializer = new JsonDeserializer();

      expect(deserializer.map({secret_key: "a", secret: "b"}, {type: IgnoreCallbackModel}).secret).toEqual("hidden");
      expect(deserializer.map({secret: "b"}, {type: IgnoreCallbackModel}).secret).toEqual("hidden");
      // not ignored: the declared name is still the fallback
      expect(deserializer.map({open: "b"}, {type: IgnoreCallbackModel}).open).toEqual("b");
      expect(deserializer.map({public_key: "a", open: "b"}, {type: IgnoreCallbackModel}).open).toEqual("a");
    });

    it("should keep the value returned by a deserialization hook over the declared name", () => {
      const deserializer = new JsonDeserializer();

      expect(deserializer.map({name: "raw"}, {type: HookModel}).name).toEqual("computed");
      expect(deserializer.map({label: "a", name: "raw"}, {type: HookModel}).name).toEqual("a");
      // the hook returned undefined: the declared name is still the fallback
      expect(deserializer.map({skipped: "raw"}, {type: HookModel}).skipped).toEqual("raw");
    });

    it("should serialize the unknown keys, but not the declared ones", () => {
      const model = Object.assign(new OpenModel(), {id: "1", name: "a", extra: 1, other: {deep: true}});

      const result = new JsonSerializer().map(model);

      expect(result).toEqual({id: "1", label: "a", extra: 1, other: {deep: true}});
      expect(Object.keys(result)).toEqual(["id", "label", "extra", "other"]);
    });
  });
});
