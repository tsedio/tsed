import {getFormioSchema, Multiple} from "@tsed/schema-formio";

describe("Multiple", () => {
  it("should declare a model with multiple field", () => {
    class Model {
      @Multiple()
      test: string;
    }

    expect(getFormioSchema(Model)).toEqual({
      components: [
        {
          disabled: false,
          input: true,
          key: "test",
          label: "Test",
          multiple: false,
          type: "textfield",
          validate: {
            required: false
          }
        }
      ],
      display: "form",
      machineName: "model",
      submissionAccess: [],
      access: [],
      tags: [],
      name: "model",
      title: "Model",
      type: "form"
    });
  });
});
