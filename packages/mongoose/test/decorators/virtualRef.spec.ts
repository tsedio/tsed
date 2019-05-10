import {descriptorOf, Store} from "@tsed/core";
import {MONGOOSE_SCHEMA} from "../../src/constants";
import {VirtualRef} from "../../src/decorators";

describe("@VirtualRef()", () => {
  describe("when type and foreign value are given", () => {
    it("should set metadata", () => {
      // GIVEN
      class Test {
      }

      const store = Store.from(Test, "test", descriptorOf(Test, "test"));
      // WHEN
      VirtualRef("RefTest", "foreign")(Test, "test", descriptorOf(Test, "test"));

      // THEN
      store.get(MONGOOSE_SCHEMA).should.deep.eq({
        ref: "RefTest",
        foreignField: "foreign",
        localField: "test"
      });
    });
  });

  describe("when options is given with minimal fields", () => {
    it("should set metadata", () => {
      // GIVEN
      class Test {
      }

      const store = Store.from(Test, "test", descriptorOf(Test, "test"));
      const options = {type: "RefTest", foreignField: "foreign"};
      // WHEN
      VirtualRef(options)(Test, "test", descriptorOf(Test, "test"));

      // THEN
      store.get(MONGOOSE_SCHEMA).should.deep.eq({
        ref: "RefTest",
        localField: "test",
        foreignField: "foreign",
        justOne: false,
        options: undefined
      });

    });
  });

  describe("when options is given with all fields", () => {
    it("should set metadata", () => {
      // GIVEN
      class Test {
      }

      const store = Store.from(Test, "test", descriptorOf(Test, "test"));
      const options = {
        type: "RefTest",
        foreignField: "foreign",
        localField: "test_2",
        justOne: true,
        options: {}
      };
      // WHEN
      VirtualRef(options)(Test, "test", descriptorOf(Test, "test"));

      // THEN
      store.get(MONGOOSE_SCHEMA).should.deep.eq({
        ref: "RefTest",
        localField: "test_2",
        foreignField: "foreign",
        justOne: true,
        options: {}
      });
    });
  });
});