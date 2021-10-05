import {MongoosePlugin} from "../../src/decorators/mongoosePlugin";
import {schemaOptions} from "../../src/utils/schemaOptions";

describe("@MongoosePlugin()", () => {
  it("should store options", () => {
    // GIVEN
    const fn = jest.fn();

    // WHEN
    @MongoosePlugin(fn, {})
    class Test {}

    // THEN
    const options = schemaOptions(Test);

    expect(options).toEqual({
      plugins: [
        {
          plugin: fn,
          options: {}
        }
      ]
    });
  });
});
