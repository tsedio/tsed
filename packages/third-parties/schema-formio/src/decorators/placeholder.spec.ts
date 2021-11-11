import {getFormioSchema} from "@tsed/schema-formio";
import {Placeholder} from "./placeholder";

describe("@Placeholder", () => {
  it("should add a placeholder on field", async () => {
    class Model {
      @Placeholder("The placeholder")
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
          placeholder: "The placeholder",
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
