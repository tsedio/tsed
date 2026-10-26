import {Groups, JsonEntityStore, JsonParameterStore, Property, Required, s} from "../index.js";
import {compile} from "./compile.js";

describe("compile() cache", () => {
  class CacheModel {
    @Required()
    id: string;

    @Groups("!creation")
    @Property()
    createdAt: Date;
  }

  class OtherClass {}

  class SameNameClass {}

  it("should return the same object for the same options (Ajv caches validators by schema identity)", () => {
    const first = compile(CacheModel, {customKeys: true});

    expect(compile(CacheModel, {customKeys: true})).toBe(first);
  });

  it("should return a different object when a primitive option or the groups change", () => {
    const base = compile(CacheModel, {customKeys: true});
    const creation = compile(CacheModel, {customKeys: true, groups: ["creation"]});

    expect(creation).not.toBe(base);
    expect(compile(CacheModel, {customKeys: true, groups: ["creation"]})).toBe(creation);
    expect(compile(CacheModel, {customKeys: false})).not.toBe(base);
    expect(creation.properties.createdAt).toBeUndefined();
    expect(base.properties.createdAt).toBeDefined();
  });

  it("should key an option holding a class by the class name", () => {
    const withClass = compile(CacheModel, {customKeys: true, model: OtherClass} as any);

    expect(compile(CacheModel, {customKeys: true, model: OtherClass} as any)).toBe(withClass);
    expect(withClass).not.toBe(compile(CacheModel, {customKeys: true}));
  });

  it("should key an option holding a nested object or an array of classes like before", () => {
    const nested = compile(CacheModel, {customKeys: true, extra: {model: SameNameClass}} as any);
    const list = compile(CacheModel, {customKeys: true, extra: [SameNameClass]} as any);

    expect(compile(CacheModel, {customKeys: true, extra: {model: SameNameClass}} as any)).toBe(nested);
    expect(compile(CacheModel, {customKeys: true, extra: [SameNameClass]} as any)).toBe(list);
    expect(list).not.toBe(nested);
  });

  it("should ignore option values JSON drops (undefined, arrow functions) like before", () => {
    const base = compile(CacheModel, {customKeys: true, groups: ["read"]});

    expect(compile(CacheModel, {customKeys: true, groups: ["read"], extra: undefined} as any)).toBe(base);
    expect(compile(CacheModel, {customKeys: true, groups: ["read"], extra: () => {}} as any)).toBe(base);
  });

  it("should cache a parameter store and a JsonSchema", () => {
    class CacheCtrl {
      method(@Groups("creation") body: CacheModel) {}
    }

    // registers the parameter
    JsonEntityStore.from(CacheCtrl, "method", 0);

    const param = JsonParameterStore.get(CacheCtrl, "method", 0);
    const schema = s.object({name: s.string()});

    expect(compile(param, {customKeys: true})).toBe(compile(param, {customKeys: true}));
    expect(compile(schema, {customKeys: true})).toBe(compile(schema, {customKeys: true}));
  });

  it("should throw for an invalid model and keep working afterwards", () => {
    expect(() => compile(undefined as any)).toThrow();
    expect(compile(CacheModel, {customKeys: true})).toBe(compile(CacheModel, {customKeys: true}));
  });
});
