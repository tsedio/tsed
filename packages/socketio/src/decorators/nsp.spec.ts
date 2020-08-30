import {Store} from "@tsed/core";
import {expect} from "chai";
import {Nsp} from "../index";

describe("Nsp", () => {
  describe("when it used as param decorator", () => {
    class Test {}

    before(() => {
      Nsp(Test, "test", 0);
      this.store = Store.from(Test);
    });

    it("should set metadata", () => {
      expect(this.store.get("socketIO")).to.deep.eq({
        handlers: {
          test: {
            parameters: {
              "0": {
                filter: "nsp",
                mapIndex: undefined,
              },
            },
          },
        },
      });
    });
  });

  describe("when it used as property decorator", () => {
    class Test {}

    before(() => {
      Nsp(Test, "test");
      this.store = Store.from(Test);
    });

    it("should set metadata", () => {
      expect(this.store.get("socketIO")).to.deep.eq({
        injectNamespaces: [{propertyKey: "test"}],
      });
    });
  });

  describe("when it used as property decorator with parameters", () => {
    class Test {
      @Nsp("/test")
      property: any;
    }

    before(() => {
      this.store = Store.from(Test);
    });

    it("should set metadata", () => {
      expect(this.store.get("socketIO")).to.deep.eq({
        injectNamespaces: [{propertyKey: "property", nsp: "/test"}],
      });
    });
  });
});
