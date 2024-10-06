import {schemaOptions} from "../utils/schemaOptions.js";
import {MongooseIndexes} from "./mongooseIndexes.js";

describe("@MongooseIndexes()", () => {
  class Test {}

  it("should store options", () => {
    // WHEN
    @MongooseIndexes([
      {fields: {field: "1"}, options: {}},
      {fields: {field2: "1"}, options: {}}
    ])
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
        },
        {
          fields: {
            field2: "1"
          },
          options: {}
        }
      ]
    });
  });
});
