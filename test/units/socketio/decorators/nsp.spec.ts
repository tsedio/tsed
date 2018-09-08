import {Store} from "../../../../packages/core/src/class/Store";
import {Nsp} from "../../../../packages/socketio/src";
import {expect} from "../../../tools";

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

    before(() => {
      Nsp(Test, "test");
      this.store = Store.from(Test);
    });

    it("should set metadata", () => {
      expect(this.store.get("socketIO")).to.deep.eq({
        injectNamespaces: [{propertyKey: "test"}]
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
        injectNamespaces: [{propertyKey: "property", nsp: "/test"}]
      });
    });
  });
});
