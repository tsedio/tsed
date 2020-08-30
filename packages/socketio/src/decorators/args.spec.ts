import {Store} from "@tsed/core";
import {expect} from "chai";
import {Args} from "../index";

describe("Args", () => {
  describe("without parameters", () => {
    class Test {}

    before(() => {
      Args()(Test, "test", 0);
      this.store = Store.from(Test);
    });

    it("should set metadata", () => {
      expect(this.store.get("socketIO")).to.deep.eq({
        handlers: {
          test: {
            parameters: {
              "0": {
                filter: "args",
                useConverter: false,
              },
            },
          },
        },
      });
    });
  });

  describe("with parameters", () => {
    class Test {}

    before(() => {
      Args(1)(Test, "test", 1);
      this.store = Store.from(Test);
    });

    it("should set metadata", () => {
      expect(this.store.get("socketIO")).to.deep.eq({
        handlers: {
          test: {
            parameters: {
              "1": {
                collectionType: undefined,
                filter: "args",
                mapIndex: 1,
                type: undefined,
                useConverter: true,
              },
            },
          },
        },
      });
    });
  });
});
