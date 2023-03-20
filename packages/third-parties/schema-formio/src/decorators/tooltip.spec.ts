import {getFormioSchema} from "../utils/getFormioSchema";
import {Tooltip} from "./tooltip";

describe("@Tooltip", () => {
  it("should add a tooltip on field", async () => {
    class Model {
      @Tooltip("The tooltip")
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
          tooltip: "The tooltip",
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
