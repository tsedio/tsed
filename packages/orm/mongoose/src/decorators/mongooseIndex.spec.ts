import {MongooseIndex} from "../../src/decorators/mongooseIndex";
import {schemaOptions} from "../../src/utils/schemaOptions";

describe("@MongooseIndex()", () => {
  class Test {}

  it("should store options", () => {
    // WHEN
    @MongooseIndex({field: "1"}, {})
    class Test {}

    // THEN
    const options = schemaOptions(Test);

    expect(options).toEqual({
      indexes: [
        {
          fields: {
            field: "1"
          },
          options: {}
        }
      ]
    });
  });
});
