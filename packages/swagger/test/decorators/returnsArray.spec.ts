import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {ReturnsArray} from "../../src";

class Test {
}

describe("ReturnsArray()", () => {
  describe("when status and configuration are given", () => {
    before(() => {
    });
    it("should set the responses", () => {
      class Ctrl {
        @ReturnsArray(400, {
          description: "Bad Request"
        })
        test() {
        }
      }

      const store = Store.fromMethod(Ctrl, "test");

      expect(store.get("responses")).to.deep.eq({
        "400": {
          collectionType: Array,
          description: "Bad Request",
          type: undefined
        }
      });
    });
  });

  describe("when a type and configuration are given", () => {
    it("should set the responses", () => {
      class Ctrl {
        @ReturnsArray(Test, {
          description: "Success"
        })
        test() {
        }
      }

      const store = Store.fromMethod(Ctrl, "test");

      expect(store.get("response")).to.deep.eq({
        collectionType: Array,
        description: "Success",
        type: Test
      });
    });
  });

  describe("when a type is given", () => {
    it("should set the responses", () => {
      class Ctrl {
        @ReturnsArray(Test)
        test() {
        }
      }

      const store = Store.fromMethod(Ctrl, "test");

      expect(store.get("response")).to.deep.eq({
        collectionType: Array,
        type: Test
      });
    });
  });

  describe("when a configuration is given", () => {
    it("should set the responses", () => {
      class Ctrl {
        @ReturnsArray({
          description: "Success",
          type: Test
        })
        test() {
        }
      }

      const store = Store.fromMethod(Ctrl, "test");

      expect(store.get("response")).to.deep.eq({
        collectionType: Array,
        description: "Success",
        type: Test
      });
    });
  });
});
