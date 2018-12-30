import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {Returns} from "../../src";

class Test {
  test1() {
  }

  test2() {
  }

  test3() {
  }

  test4() {
  }
}

describe("Returns()", () => {
  describe("when status and configuration are given", () => {
    before(() => {
      Returns(400, {
        description: "Bad Request"
      })(Test, "test1", descriptorOf(Test, "test1"));
      this.store = Store.fromMethod(Test, "test1");
    });
    it("should set the responses", () => {
      expect(this.store.get("responses")).to.deep.eq({
        "400": {
          collectionType: undefined,
          description: "Bad Request",
          headers: undefined,
          type: undefined
        }
      });
    });
  });

  describe("when a type and configuration are given", () => {
    before(() => {
      Returns(Test, {
        description: "Success"
      })(Test, "test2", descriptorOf(Test, "test2"));
      this.store = Store.fromMethod(Test, "test2");
    });
    it("should set the responses", () => {
      expect(this.store.get("response")).to.deep.eq({
        collectionType: undefined,
        description: "Success",
        headers: undefined,
        type: Test
      });
    });
  });

  describe("when a type is given", () => {
    before(() => {
      Returns(Test)(Test, "test3", descriptorOf(Test, "test3"));
      this.store = Store.fromMethod(Test, "test3");
    });
    it("should set the responses", () => {
      expect(this.store.get("response")).to.deep.eq({
        collectionType: undefined,
        description: undefined,
        headers: undefined,
        type: Test
      });
    });
  });

  describe("when a configuration is given", () => {
    before(() => {
      Returns({
        description: "Success",
        type: Test
      })(Test, "test4", descriptorOf(Test, "test4"));
      this.store = Store.fromMethod(Test, "test4");
    });
    it("should set the responses", () => {
      expect(this.store.get("response")).to.deep.eq({
        collectionType: undefined,
        description: "Success",
        headers: undefined,
        type: Test
      });
    });
  });
});
