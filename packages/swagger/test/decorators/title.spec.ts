import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {prototypeOf} from "../../../core/src/utils";
import {Title} from "../../src";

class Test {
  test() {
  }
}

describe("Title()", () => {
  describe("when title is used as method decorator", () => {
    before(() => {
      Title("title")(prototypeOf(Test), "test", descriptorOf(Test, "test"));
      this.store = Store.from(Test, "test", descriptorOf(Test, "test"));
    });
    it("should set the schema", () => {
      expect(this.store.get("operation")).to.deep.eq({title: "title"});
    });
  });

  describe("when title is used as property decorator", () => {
    before(() => {
      Title("title")(Test, "test");
      this.store = Store.from(Test, "test");
    });
    it("should set the schema", () => {
      expect(this.store.get("schema").toObject()).to.deep.eq({title: "title"});
    });
  });
  describe("when title is used as parameters decorator", () => {
    before(() => {
      Title("title")(Test, "test", 0);
      this.store = Store.from(Test, "test", 0);
    });
    it("should set the schema", () => {
      expect(this.store.get("baseParameter")).to.deep.eq({title: "title"});
    });
  });
});
