import {getFormioSchema} from "../utils/getFormioSchema.js";
import {ErrorMessage} from "./errorMessage.js";

describe("@ErrorMessage", () => {
  it("should set a custom error message", async () => {
    class Model {
      @ErrorMessage("My message")
      test: string;
    }

    expect(await getFormioSchema(Model)).toEqual({
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
