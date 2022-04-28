import {expect} from "chai";
import {DIConfiguration} from "../../src";

describe("DIConfiguration", () => {
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

      configuration.set("test", "test");
      expect(configuration.get("test")).to.eq("test");
      expect("test" in configuration).to.eq(true);
      expect(configuration.get("test")).to.eq("test");
    });

    it("ownKeys", () => {
      const configuration = new DIConfiguration();
      configuration.set("test", "test");
      expect(Reflect.ownKeys(configuration)).to.deep.eq(["default", "map", "scopes", "resolvers", "imports", "routes", "logger", "test"]);
    });

    it("defineProperty", () => {
      const configuration = new (class extends DIConfiguration {})();

      expect(Reflect.defineProperty(configuration, "test", {})).to.eq(true);
      expect(Reflect.deleteProperty(configuration, "test")).to.eq(false);
    });
  });
});
