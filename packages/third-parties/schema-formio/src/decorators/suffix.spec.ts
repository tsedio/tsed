import {getFormioSchema} from "../utils/getFormioSchema.js";
import {Suffix} from "./suffix.js";

describe("@Suffix", () => {
  it("should add a suffix on field", async () => {
    class Model {
      @Suffix("The suffix")
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
          suffix: "The suffix",
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
