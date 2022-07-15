import {Store} from "@tsed/core";
import {Nsp} from "../index";

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
    it("should set metadata", () => {
      class Test {
        @Nsp("/test")
        property: any;
      }

      const store = Store.from(Test);
      expect(store.get("socketIO")).toEqual({
        injectNamespaces: [{propertyKey: "property", nsp: "/test"}]
      });
    });
  });
});
