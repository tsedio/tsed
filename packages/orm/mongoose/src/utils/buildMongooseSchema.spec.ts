import {PropertyMetadata} from "@tsed/common";
import {Property} from "@tsed/schema";
import {expect} from "chai";
import {MONGOOSE_SCHEMA} from "../../src/constants";
import {buildMongooseSchema} from "../../src/utils/createSchema";

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
      expect(result.schema).to.deep.eq({
        test: {
          required: false,
          type: String
        }
      });

      expect(result.virtuals.size).to.eq(0);
    });
  });

  describe("when mongoose schema has virtual ref", () => {
    it("should return schema", () => {
      class Test {
        test: String;
      }

      const propertyMetadata = PropertyMetadata.get(Test, "test");
      propertyMetadata.type = String;
      propertyMetadata.store.set(MONGOOSE_SCHEMA, {
        ref: "ref",
        justOne: true,
        localField: "localField",
        foreignField: "foreignField"
      });

      PropertyMetadata.get(Test, "_id");
      // WHEN
      const result = buildMongooseSchema(Test);

      // THEN
      expect(result.schema).to.deep.eq({});

      expect(result.virtuals.size).to.eq(1);
      expect(result.virtuals.get("test")).to.deep.eq({
        foreignField: "foreignField",
        justOne: true,
        localField: "localField",
        ref: "ref"
      });
    });
  });
});
