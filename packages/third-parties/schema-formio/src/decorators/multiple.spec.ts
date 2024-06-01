import {getFormioSchema} from "../utils/getFormioSchema.js";
import {Multiple} from "./multiple.js";

describe("Multiple", () => {
  it("should declare a model with multiple field", async () => {
    class Model {
      @Multiple()
      test: string;
    }

    expect(await getFormioSchema(Model)).toEqual({
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
