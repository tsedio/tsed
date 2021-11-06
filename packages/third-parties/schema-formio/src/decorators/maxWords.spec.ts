import {getFormioSchema} from "@tsed/schema-formio";
import {MaxWords} from "./maxWords";

describe("@MaxWords", () => {
  it("should set the max words", () => {
    class Model {
      @MaxWords(10)
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
