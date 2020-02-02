import {Store} from "@tsed/core";
import {expect} from "chai";
import {Returns} from "../../src";

class Test {

}

describe("Returns()", () => {
  describe("when status and configuration are given", () => {
    before(() => {

    });
    it("should set the responses", () => {
      class Ctrl {
        @Returns(400, {
          description: "Bad Request"
        })
        test() {

        }
      }

      const store = Store.fromMethod(Ctrl, "test");

      expect(store.get("responses")).to.deep.eq({
        "400": {
          collectionType: undefined,
          description: "Bad Request",
          type: undefined
        }
      });
    });
  });

  describe("when a type and configuration are given", () => {
    before(() => {

    });
    it("should set the responses", () => {
      class Ctrl {
        @Returns(Test, {
          description: "Success"
        })
        test() {

        }
      }

      const store = Store.fromMethod(Ctrl, "test");

      expect(store.get("response")).to.deep.eq({
        collectionType: undefined,
        description: "Success",
        type: Test
      });
    });
  });

  describe("when a type is given", () => {
    before(() => {
    });
    it("should set the responses", () => {
      class Ctrl {
        @Returns(Test)
        test() {

        }
      }

      const store = Store.fromMethod(Ctrl, "test");

      expect(store.get("response")).to.deep.eq({
        collectionType: undefined,
        type: Test
      });
    });
  });

  describe("when a configuration is given", () => {
    before(() => {

    });
    it("should set the responses", () => {
      class Ctrl {
        @Returns({
          description: "Success",
          type: Test
        })
        test() {

        }
      }

      const store = Store.fromMethod(Ctrl, "test");

      expect(store.get("response")).to.deep.eq({
        collectionType: undefined,
        description: "Success",
        type: Test
      });
    });
  });
});
