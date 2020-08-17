import {Store} from "@tsed/core";
import {getJsonSchema, Property} from "@tsed/schema";
import {expect} from "chai";
import {MONGOOSE_SCHEMA} from "../../src/constants";
import {VirtualRef} from "../../src/decorators";

describe("@VirtualRef()", () => {
  describe("when type and foreign value are given", () => {
    it("should set metadata", () => {
      // GIVEN
      class RefTest {}

      class Test {
        @VirtualRef("RefTest", "foreign")
        @Property(() => RefTest)
        test: VirtualRef<RefTest>;
      }

      // THEN
      const store = Store.from(Test, "test");
      expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
        ref: "RefTest",
        foreignField: "foreign",
        localField: "test"
      });

      expect(getJsonSchema(Test)).to.deep.eq({
        definitions: {
          RefTest: {
            type: "object"
          }
        },
        properties: {
          test: {
            $ref: "#/definitions/RefTest"
          }
        },
        type: "object"
      });
    });
  });

  describe("when options is given with minimal fields", () => {
    it("should set metadata", () => {
      // GIVEN
      class RefTest {}

      const type = () => RefTest;

      class Test {
        @VirtualRef({type, foreignField: "foreign"})
        test: VirtualRef<RefTest>;
      }

      // THEN
      const store = Store.from(Test, "test");
      expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
        ref: type,
        localField: "test",
        foreignField: "foreign",
        justOne: false,
        options: undefined
      });
      expect(getJsonSchema(Test)).to.deep.eq({
        definitions: {
          RefTest: {
            type: "object"
          }
        },
        properties: {
          test: {
            $ref: "#/definitions/RefTest"
          }
        },
        type: "object"
      });
    });
  });

  describe("when options is given with all fields", () => {
    it("should set metadata", () => {
      // GIVEN
      class RefTest {}

      class Test {
        @VirtualRef({
          type: "RefTest",
          foreignField: "foreign",
          localField: "test_2",
          justOne: true,
          options: {}
        })
        test: VirtualRef<RefTest>;
      }

      // THEN
      const store = Store.from(Test, "test");
      expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
        ref: "RefTest",
        localField: "test_2",
        foreignField: "foreign",
        justOne: true,
        options: {}
      });

      expect(getJsonSchema(Test)).to.deep.eq({
        definitions: {
          VirtualRef: {
            type: "object"
          }
        },
        properties: {
          test_2: {
            $ref: "#/definitions/VirtualRef"
          }
        },
        type: "object"
      });
    });
  });
});
