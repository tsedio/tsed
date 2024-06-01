import {getFormioSchema} from "../utils/getFormioSchema.js";
import {MinWords} from "./minWords.js";

describe("@MinWords", () => {
  it("should set the min words", async () => {
    class Model {
      @MinWords(10)
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
            minWords: 10
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
