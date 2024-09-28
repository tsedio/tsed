import {JsonEntityStore, Property} from "@tsed/schema";
import {Types} from "mongoose";

import {buildMongooseSchema} from "../../src/utils/createSchema.js";
import {MONGOOSE_SCHEMA} from "../constants/constants.js";

describe("buildMongooseSchema", () => {
  describe("when mongoose schema hasn't ref", () => {
    it("should return schema", () => {
      class Test {
        @Property()
        _id: string;

        @Property()
        test: String;
      }

      // WHEN
      const result = buildMongooseSchema(Test);

      // THEN
      expect(result.schema).toEqual({
        _id: {
          required: false,
          type: String
        },
        test: {
          required: false,
          type: String
        }
      });

      expect(result.virtuals.size).toBe(0);
    });
  });

  describe("when mongoose schema has virtual ref", () => {
    it("should return schema", () => {
      class Test {
        test: String;
      }

      const propertyMetadata = JsonEntityStore.get(Test, "test");
      propertyMetadata.type = String;
      propertyMetadata.store.set(MONGOOSE_SCHEMA, {
        ref: "ref",
        justOne: true,
        localField: "localField",
        foreignField: "foreignField"
      });

      // WHEN
      const result = buildMongooseSchema(Test);

      // THEN
      expect(result.schema).toEqual({});

      expect(result.virtuals.size).toBe(1);
      expect(result.virtuals.get("test")).toEqual({
        foreignField: "foreignField",
        justOne: true,
        localField: "localField",
        ref: "ref"
      });
    });
  });
});
