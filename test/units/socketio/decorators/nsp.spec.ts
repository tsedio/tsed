import {Store} from "../../../../src/core/class/Store";
import {Nsp} from "../../../../src/socketio";
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
      @Nsp("/test") property: any;
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
