import {ErrorLabel, getFormioSchema} from "@tsed/schema-formio";

describe("@ErrorLabel", () => {
  it("should set the error label", () => {
    class Model {
      @ErrorLabel("Error label")
      test: string;
    }

    expect(getFormioSchema(Model)).toEqual({
      components: [
        {
          disabled: false,
          errorLabel: "Error label",
          input: true,
          key: "test",
          label: "Test",
          type: "textfield",
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
