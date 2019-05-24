import {PropertyRegistry} from "@tsed/common";
import {MONGOOSE_SCHEMA} from "../../src/constants";
import {buildMongooseSchema} from "../../src/utils/createSchema";

describe("buildMongooseSchema", () => {
  describe("when mongoose schema hasn't ref", () => {
    class Test {
      test: String;
    }

    it("should return schema", () => {
      const propertyMetadata = PropertyRegistry.get(Test, "test");
      propertyMetadata.type = String;
      propertyMetadata.store.set(MONGOOSE_SCHEMA, {});

      PropertyRegistry.get(Test, "_id");
      // WHEN
      const result = buildMongooseSchema(Test);

      // THEN
      result.schema.should.deep.eq({
        test: {
          required: false,
          type: String
        }
      });

      result.virtuals.size.should.eq(0);
    });
  });

  describe("when mongoose schema has virtual ref", () => {
    class Test {
      test: String;
    }

    it("should return schema", () => {
      const propertyMetadata = PropertyRegistry.get(Test, "test");
      propertyMetadata.type = String;
      propertyMetadata.store.set(MONGOOSE_SCHEMA, {
        ref: "ref",
        localField: "localField",
        foreignField: "foreignField"
      });

      PropertyRegistry.get(Test, "_id");
      // WHEN
      const result = buildMongooseSchema(Test);

      // THEN
      result.schema.should.deep.eq({});

      result.virtuals.size.should.eq(1);
      result.virtuals.get("test").should.deep.eq({
        "foreignField": "foreignField",
        "justOne": true,
        "localField": "localField",
        "ref": "ref"
      });
    });
  });
});
