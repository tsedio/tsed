import {getFormioSchema} from "../utils/getFormioSchema";
import {InputTags} from "./inputTags";

describe("InputTags", () => {
  it("should declare a model with Tags field", async () => {
    class Model {
      @InputTags()
      test: string[];
    }

    expect(await getFormioSchema(Model)).toEqual({
      components: [
        {
          key: "test",
          type: "tags",
          input: true,
          label: "Test",
          storeas: "array",
          tableView: false,
          disabled: false,
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
