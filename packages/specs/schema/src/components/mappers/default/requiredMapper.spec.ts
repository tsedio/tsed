import {s} from "../../../fn/index.js";

describe("requiredMapper()", () => {
  it("should keep the other required properties when a property is optional", () => {
    const schema = s.object({
      id: s.string().required(),
      name: s.string().required(),
      description: s.string().optional()
    });

    expect(schema.toJSON().required).toEqual(["id", "name"]);
  });

  it("should remove an optional property from the required list declared on the object", () => {
    const schema = s
      .object({
        id: s.string(),
        name: s.string(),
        description: s.string().optional()
      })
      .required(["id", "name", "description"]);

    expect(schema.toJSON().required).toEqual(["id", "name"]);
  });
});
