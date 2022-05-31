import {GlobalProviderRegistry, Provider, ProviderType} from "../../src";

describe("GlobalProviderRegistry", () => {
  describe("createRegistry()", () => {
    it("should create registry", () => {
      // GIVEN
      const providers = new GlobalProviderRegistry();

      // WHEN
      providers.createRegistry("test", Provider, {});

      // THEN
      expect(providers.getRegistrySettings("test")).toEqual({
        model: Provider
      });
    });
  });
  describe("getRegistrySettings()", () => {
    it("should get registry from provider type (CONTROLLER)", () => {
      // GIVEN
      const providers = new GlobalProviderRegistry();
      providers.createRegistry(ProviderType.CONTROLLER, Provider, {});

      const provider = new Provider(Symbol.for("token"));
      provider.type = ProviderType.CONTROLLER;

      providers.set(Symbol.for("token"), provider);

      // WHEN
      const settings = providers.getRegistrySettings(Symbol.for("token"));

      // THEN
      expect(settings).toEqual({
        model: Provider
      });
    });
    it("should get registry from provider type (PROVIDER)", () => {
      // GIVEN
      const providers = new GlobalProviderRegistry();
      const provider = new Provider("token");
      provider.type = ProviderType.PROVIDER;
      // WHEN
      const settings = providers.getRegistrySettings(provider);

      // THEN
      expect(settings).toEqual({
        model: Provider
      });
    });
  });
  describe("merge()", () => {
    it("should create new metadata", () => {
      const registry = new GlobalProviderRegistry();
      const clazz = class {};

      registry.merge(clazz, {attr1: 1});
      expect(registry.get(clazz)?.attr1).toEqual(1);
    });

    it("should merge metadata", () => {
      const registry = new GlobalProviderRegistry();
      const clazz = class {};
      registry.merge(clazz, {attr1: 1});
      registry.merge(clazz, {attr2: 2});

      expect(registry.get(clazz)?.attr1).toEqual(1);
      expect(registry.get(clazz)?.attr2).toEqual(2);

      registry.delete(clazz);

      expect(registry.get(clazz)).toBeUndefined();
    });
  });
});
