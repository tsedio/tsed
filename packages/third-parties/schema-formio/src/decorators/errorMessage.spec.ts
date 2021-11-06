import {getFormioSchema} from "@tsed/schema-formio";
import {ErrorMessage} from "./errorMessage";

describe("@ErrorMessage", () => {
  it("should set a custom error message", () => {
    class Model {
      @ErrorMessage("My message")
      test: string;
    }

    expect(getFormioSchema(Model)).toEqual({
      components: [
        {
          disabled: false,
          input: true,
          key: "test",
          label: "Test",
          type: "textfield",
          validate: {
            required: false,
            customMessage: "My message"
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
