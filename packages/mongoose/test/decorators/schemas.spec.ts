import {Property} from "@tsed/common/src";
import {expect} from "chai";
import {getSchema, Model, MongooseSchema, ObjectID} from "../../src";

describe("@MongooseSchema", () => {
  it("should declare a schema with some options", () => {
    // GIVEN
    @MongooseSchema({schemaOptions: {_id: false}})
    class MySchema {

      @Property()
      someProperty: string;
    }

    @Model()
    class ModelWithSchema {
      @ObjectID("id")
      _id: string;

      @Property()
      mySchema: MySchema;
    }

    const schema = getSchema(MySchema);

    // @ts-ignore
    expect(schema.options._id).to.deep.eq(false);
  });
});
