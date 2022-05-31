import {DIConfiguration} from "../../src";

describe("DIConfiguration", () => {
  describe("scopes()", () => {
    it("should get scopes", () => {
      // GIVEN
      const configuration = new DIConfiguration();

      configuration.scopes = {};
      expect(configuration.scopes).toEqual({});
    });
  });

  describe("imports()", () => {
    it("should get imports", () => {
      // GIVEN
      const configuration = new DIConfiguration();

      configuration.imports = [];
      expect(configuration.imports).toEqual([]);
    });
  });

  describe("resolvers()", () => {
    it("should get resolvers", () => {
      // GIVEN
      const configuration = new DIConfiguration();

      configuration.resolvers = [];
      expect(configuration.resolvers).toEqual([]);
    });
  });

  describe("proxy", () => {
    it("should set and get data", () => {
      const configuration = new DIConfiguration();

      configuration.set("test", "test");
      expect(configuration.get("test")).toEqual("test");
      expect("test" in configuration).toEqual(true);
      expect(configuration.get("test")).toEqual("test");
    });

    it("ownKeys", () => {
      const configuration = new DIConfiguration();
      configuration.set("test", "test");
      expect(Reflect.ownKeys(configuration)).toEqual(["default", "map", "scopes", "resolvers", "imports", "routes", "logger", "test"]);
    });

    it("defineProperty", () => {
      const configuration = new (class extends DIConfiguration {})();

      expect(Reflect.defineProperty(configuration, "test", {})).toEqual(true);
      expect(Reflect.deleteProperty(configuration, "test")).toEqual(false);
    });

    describe("resolve()", () => {
      it("should replace rootDir", () => {
        const configuration = new DIConfiguration();
        configuration.set("rootDir", "/root");
        expect(configuration.resolve("${rootDir}")).toEqual("/root");
      });
    });
  });
});
