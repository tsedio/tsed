import {getJsonSchema, Property} from "@tsed/schema";
import {Store} from "@tsed/core";
import {Model} from "@tsed/mongoose";
import {MONGOOSE_SCHEMA} from "../constants";
import {VirtualRef} from "./virtualRef";

describe("@VirtualRef()", () => {
  describe("when type and foreign value are given", () => {
    it("should set metadata", () => {
      // WHEN
      class Test {
        @VirtualRef("RefTest", "foreign")
        test: any;
      }

      // THEN
      const store = Store.from(Test, "test");

      expect(store.get(MONGOOSE_SCHEMA)).toEqual({
        ref: "RefTest",
        justOne: false,
        foreignField: "foreign",
        localField: "_id",
        options: undefined
      });
    });
  });

  describe("when options is given with minimal fields", () => {
    it("should set metadata", () => {
      // WHEN
      class Test {
        @VirtualRef({type: "RefTest", foreignField: "foreign"})
        test: any;
      }

      // THEN
      const store = Store.from(Test, "test");

      expect(store.get(MONGOOSE_SCHEMA)).toEqual({
        ref: "RefTest",
        localField: "_id",
        foreignField: "foreign",
        justOne: false,
        options: undefined
      });
    });
  });

  describe("when options is given with all fields", () => {
    it("should set metadata", () => {
      // WHEN
      class Test {
        @VirtualRef({
          type: "RefTest",
          foreignField: "foreign",
          localField: "test_2",
          justOne: true,
          options: {}
        })
        test: any;
      }

      // THEN
      const store = Store.from(Test, "test");

      expect(store.get(MONGOOSE_SCHEMA)).toEqual({
        ref: "RefTest",
        localField: "test_2",
        foreignField: "foreign",
        justOne: true,
        options: {}
      });
    });
  });

  describe("with a given model", () => {
    it("should set metadata", () => {
      @Model({name: "VirtualTestPerson"})
      class TestPerson {
        @Property()
        name: string;

        @Property()
        band: string;
      }

      // WHEN
      @Model({name: "VirtualTestBand"})
      class TestBand {
        @VirtualRef({
          ref: TestPerson,
          foreignField: "foreign",
          localField: "test_2",
          justOne: true,
          options: {}
        })
        members: VirtualRef<TestPerson>;
      }

      // THEN
      const store = Store.from(TestBand, "members");

      expect(store.get(MONGOOSE_SCHEMA)).toEqual({
        ref: "VirtualTestPerson",
        localField: "test_2",
        foreignField: "foreign",
        justOne: true,
        options: {}
      });

      expect(getJsonSchema(TestBand)).toEqual({
        definitions: {
          TestPerson: {
            properties: {
              band: {
                type: "string"
              },
              name: {
                type: "string"
              }
            },
            type: "object"
          }
        },
        properties: {
          members: {
            $ref: "#/definitions/TestPerson"
          }
        },
        type: "object"
      });
    });
  });
});
