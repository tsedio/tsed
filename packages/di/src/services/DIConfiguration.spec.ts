import {expect} from "chai";
import {DIConfiguration, ProviderScope, ProviderType} from "../../src";

describe("DIConfiguration", () => {
  describe("merge()", () => {
    it("should merge object", () => {
      // GIVEN
      const configuration = new DIConfiguration();

      configuration.set({
        scopes: {
          [ProviderType.VALUE]: ProviderScope.SINGLETON
        },
        shouldResolved: "${scopes.value}",
        shouldResolved2: "<scopes.value>",
        shouldResolved3: "{{scopes.value}}"
      });
      // WHEN
      configuration.merge({
        scopes: {
          [ProviderType.VALUE]: ProviderScope.INSTANCE,
          [ProviderType.PROVIDER]: ProviderScope.SINGLETON
        }
      });

      // THEN
      // @ts-ignore
      expect(Array.from(configuration.map.entries())).to.deep.eq([
        [
          "scopes",
          {
            provider: "singleton",
            value: "singleton"
          }
        ],
        ["shouldResolved", "${scopes.value}"],
        ["shouldResolved2", "<scopes.value>"],
        ["shouldResolved3", "{{scopes.value}}"]
      ]);

      expect(configuration.get<any>("shouldResolved")!).to.eq("singleton");
      expect(configuration.get<any>("shouldResolved2")!).to.eq("singleton");
      expect(configuration.get<any>("shouldResolved3")!).to.eq("singleton");
      expect(configuration.shouldResolved).to.eq("singleton");
    });
  });

  describe("scopes()", () => {
    it("should get scopes", () => {
      // GIVEN
      const configuration = new DIConfiguration();

      configuration.scopes = {};
      expect(configuration.scopes).to.deep.equal({});
    });
  });

  describe("imports()", () => {
    it("should get imports", () => {
      // GIVEN
      const configuration = new DIConfiguration();

      configuration.imports = [];
      expect(configuration.imports).to.deep.equal([]);
    });
  });

  describe("resolvers()", () => {
    it("should get resolvers", () => {
      // GIVEN
      const configuration = new DIConfiguration();

      configuration.resolvers = [];
      expect(configuration.resolvers).to.deep.equal([]);
    });
  });

  describe("proxy", () => {
    it("should set and get data", () => {
      const configuration = new DIConfiguration();

      configuration.test = "test";
      expect(configuration.test).to.eq("test");
      expect("test" in configuration).to.eq(true);
      expect(configuration.get("test")).to.eq("test");
    });

    it("ownKeys", () => {
      const configuration = new DIConfiguration();
      configuration.test = "test";
      expect(Reflect.ownKeys(configuration)).to.deep.eq(["default", "map", "scopes", "resolvers", "imports", "routes", "test"]);
    });

    it("defineProperty", () => {
      const configuration = new (class extends DIConfiguration {})();

      expect(Reflect.defineProperty(configuration, "test", {})).to.eq(true);
      expect(Reflect.deleteProperty(configuration, "test")).to.eq(false);
    });
  });
});
