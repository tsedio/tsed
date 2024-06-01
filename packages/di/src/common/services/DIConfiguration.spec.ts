import {Env} from "@tsed/core";
import {DIConfiguration} from "./DIConfiguration.js";

describe("DIConfiguration", () => {
  describe("version()", () => {
    it("should get version", () => {
      // GIVEN
      const configuration = new DIConfiguration();

      configuration.version = "1.0.0";
      expect(configuration.version).toEqual("1.0.0");
    });
  });
  describe("env()", () => {
    it("should get env", () => {
      // GIVEN
      const configuration = new DIConfiguration();

      configuration.env = Env.DEV;
      expect(configuration.env).toEqual(Env.DEV);
    });
  });
  describe("debug()", () => {
    it("should return debug", () => {
      // GIVEN
      const configuration = new DIConfiguration();

      configuration.debug = true;
      expect(configuration.debug).toEqual(true);

      configuration.debug = false;
      expect(configuration.debug).toEqual(false);
    });
  });
  describe("forEach()", () => {
    it("should return all key, value", () => {
      // GIVEN
      const configuration = new DIConfiguration();
      const obj: any = {};
      configuration.forEach((value, key) => {
        obj[key] = value;
      });
      expect(obj).toEqual({
        imports: [],
        logger: {},
        resolvers: [],
        routes: [],
        scopes: {}
      });
    });
  });
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

  describe("rootDir()", () => {
    it("should replace rootDir", () => {
      const configuration = new DIConfiguration();
      configuration.set("rootDir", "/root");
      expect(configuration.resolve("${rootDir}")).toEqual("/root");
    });
  });
});
