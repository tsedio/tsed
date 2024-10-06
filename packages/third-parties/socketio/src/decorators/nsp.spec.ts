import {Store} from "@tsed/core";

import {Nsp} from "../index.js";

describe("Nsp", () => {
  describe("when it used as param decorator", () => {
    class Test {}

    it("should set metadata", () => {
      Nsp(Test, "test", 0);
      const store = Store.from(Test);

      expect(store.get("socketIO")).toEqual({
        handlers: {
          test: {
            parameters: {
              "0": {
                filter: "nsp",
                mapIndex: undefined
              }
            }
          }
        }
      });
    });
  });

  describe("when it used as property decorator", () => {
    class Test {}

    beforeAll(() => {});

    it("should set metadata", () => {
      Nsp(Test.prototype, "test");

      const store = Store.from(Test);
      expect(store.get("socketIO")).toEqual({
        injectNamespaces: [{propertyKey: "test"}]
      });
    });
  });

  describe("when it used as property decorator with parameters", () => {
    it("should set metadata (string)", () => {
      class Test {
        @Nsp("/test")
        property: any;
      }

      const store = Store.from(Test);
      expect(store.get("socketIO")).toEqual({
        injectNamespaces: [{propertyKey: "property", nsp: "/test"}]
      });
    });

    it("should set metadata (RegExp)", () => {
      const regexp = new RegExp(/test/);

      class Test {
        @Nsp(regexp)
        property: any;
      }

      const store = Store.from(Test);
      expect(store.get("socketIO")).toEqual({
        injectNamespaces: [{propertyKey: "property", nsp: regexp}]
      });
    });
  });
});
