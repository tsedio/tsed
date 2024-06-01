import {getFormioSchema} from "../utils/getFormioSchema.js";
import {Password} from "./password.js";

describe("Password", () => {
  it("should declare a model with password field", async () => {
    class Model {
      @Password()
      test: string;
    }

    expect(await getFormioSchema(Model)).toEqual({
      components: [
        {
          disabled: false,
          input: true,
          key: "test",
          label: "Test",
          protected: true,
          type: "password",
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
