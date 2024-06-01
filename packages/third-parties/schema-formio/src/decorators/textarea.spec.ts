import {getFormioSchema} from "../utils/getFormioSchema.js";
import {Textarea} from "./textarea.js";

describe("Textarea", () => {
  it("should declare a model with Textarea field", async () => {
    class Model {
      @Textarea()
      test: string;
    }

    expect(await getFormioSchema(Model)).toEqual({
      components: [
        {
          autoExpand: false,
          disabled: false,
          input: true,
          label: "Test",
          key: "test",
          type: "textarea",
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
