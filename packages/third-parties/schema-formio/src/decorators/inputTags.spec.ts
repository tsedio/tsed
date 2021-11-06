import {getFormioSchema, InputTags} from "@tsed/schema-formio";

describe("InputTags", () => {
  it("should declare a model with Tags field", () => {
    class Model {
      @InputTags()
      test: string[];
    }

    expect(getFormioSchema(Model)).toEqual({
      components: [
        {
          key: "test",
          type: "tags",
          input: true,
          label: "Test",
          storeas: "array",
          tableView: false,
          disabled: false,
          validate: {
            required: false
          }
        }
      ],
      display: "form",
      machineName: "model",
      name: "model",
      title: "Model",
      type: "form",
      submissionAccess: [],
      access: [],
      tags: []
    });
  });
});
