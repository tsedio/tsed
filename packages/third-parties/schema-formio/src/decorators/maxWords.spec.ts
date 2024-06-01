import {getFormioSchema} from "../utils/getFormioSchema.js";
import {MaxWords} from "./maxWords.js";

describe("@MaxWords", () => {
  it("should set the max words", async () => {
    class Model {
      @MaxWords(10)
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
            maxWords: 10
          }
        }
      ],
      submissionAccess: [],
      access: [],
      tags: [],
      display: "form",
      machineName: "model",
      name: "model",
      title: "Model",
      type: "form"
    });
  });
});
