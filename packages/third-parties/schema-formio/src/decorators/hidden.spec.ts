import {getFormioSchema} from "../utils/getFormioSchema.js";
import {Hidden} from "./hidden.js";

describe("Hidden", () => {
  it("should declare a model with Hidden field", async () => {
    class Model {
      @Hidden()
      test: string;
    }

    expect(await getFormioSchema(Model)).toEqual({
      components: [
        {
          disabled: false,
          hidden: true,
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
