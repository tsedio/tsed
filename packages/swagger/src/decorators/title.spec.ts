import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {Title} from "../index";

describe("Title()", () => {
  describe("when title is used as method decorator", () => {
    it("should set the schema", () => {
      class Test {
        @Title("title")
        test() {
        }
      }

      const store = Store.from(Test, "test", descriptorOf(Test, "test"));
      expect(store.get("operation")).to.deep.eq({title: "title"});
    });
  });

  describe("when title is used as property decorator", () => {
    it("should set the schema", () => {
      class Test {
        @Title("title")
        test: string;
      }

      const store = Store.from(Test, "test");

      expect(store.get("schema").toObject()).to.deep.eq({title: "title", type: "string"});
    });
  });
  describe("when title is used as parameters decorator", () => {
    it("should set the schema", () => {
      class Test {
        test(@Title("title") param: string) {
        }
      }

      const store = Store.from(Test, "test", 0);

      expect(store.get("baseParameter")).to.deep.eq({title: "title"});
    });
  });
});
