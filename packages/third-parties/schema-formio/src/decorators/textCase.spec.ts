import {getFormioSchema} from "../utils/getFormioSchema.js";
import {TextCase} from "./textCase.js";

describe("@TextCase", () => {
  it("should change the case", async () => {
    class Model {
      @TextCase("lowercase")
      test: string;
    }

    expect(await getFormioSchema(Model)).toEqual({
      access: [],
      components: [
        {
          disabled: false,
          input: true,
          key: "test",
          label: "Test",
          case: "lowercase",
          type: "textfield",
          validate: {
            required: false
          }
        }
      ],
      display: "form",
      machineName: "model",
      name: "model",
      submissionAccess: [],
      tags: [],
      title: "Model",
      type: "form"
    });
  });
});
