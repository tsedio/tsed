import {getFormioSchema} from "@tsed/schema-formio";
import {MinWords} from "./minWords";

describe("@MinWords", () => {
  it("should set the min words", () => {
    class Model {
      @MinWords(10)
      test: string;
    }

    expect(getFormioSchema(Model)).toEqual({
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
