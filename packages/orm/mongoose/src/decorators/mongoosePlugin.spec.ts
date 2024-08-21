import {MongoosePlugin} from "../../src/decorators/mongoosePlugin.js";
import {schemaOptions} from "../../src/utils/schemaOptions.js";

describe("@MongoosePlugin()", () => {
  it("should store options", () => {
    // GIVEN
    const fn = vi.fn();

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
