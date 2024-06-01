import {getFormioSchema} from "../utils/getFormioSchema.js";
import {ErrorLabel} from "./errorLabel.js";

describe("@ErrorLabel", () => {
  it("should set the error label", async () => {
    class Model {
      @ErrorLabel("Error label")
      test: string;
    }

    expect(await getFormioSchema(Model)).toEqual({
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
