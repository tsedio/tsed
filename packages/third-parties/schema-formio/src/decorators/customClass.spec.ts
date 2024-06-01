import {getFormioSchema} from "../utils/getFormioSchema.js";
import {CustomClass} from "./customClass.js";

describe("@CustomClass", () => {
  it("should add a custom css class on field", async () => {
    class Model {
      @CustomClass("css-class")
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
          customClass: "css-class",
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
