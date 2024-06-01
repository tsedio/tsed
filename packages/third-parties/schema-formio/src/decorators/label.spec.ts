import {getFormioSchema} from "../utils/getFormioSchema.js";
import {Label} from "./label.js";

describe("@Label", () => {
  it("should add a tooltip on field", async () => {
    class Model {
      @Label("The label")
      test: string;
    }

    expect(await getFormioSchema(Model)).toEqual({
      access: [],
      components: [
        {
          disabled: false,
          input: true,
          key: "test",
          label: "The label",
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
