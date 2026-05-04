import {DITest} from "@tsed/di";
import {object, string} from "@tsed/schema";

import {validate} from "./validate.js";

describe("validate", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  it("should validate a value against a JSON schema or a type", async () => {
    const value = {name: "John"};
    const schema = object({
      name: string()
    });

    const result = await validate(value, schema);

    expect(result).toEqual(value);
  });
});
