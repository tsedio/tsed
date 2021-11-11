import {getFormioSchema} from "@tsed/schema-formio";
import {Prefix} from "./prefix";

describe("@Prefix", () => {
  it("should add a prefix on field", async () => {
    class Model {
      @Prefix("The prefix")
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
          prefix: "The prefix",
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
