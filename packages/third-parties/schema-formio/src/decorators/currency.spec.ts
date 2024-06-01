import {getFormioSchema} from "../utils/getFormioSchema.js";
import {Currency} from "./currency.js";

describe("Currency", () => {
  it("should declare currency", async () => {
    class Model {
      @Currency()
      test: number;
    }

    expect(await getFormioSchema(Model)).toEqual({
      components: [
        {
          currency: "USD",
          delimiter: true,
          disabled: false,
          input: true,
          inputFormat: "plain",
          label: "Test",
          key: "test",
          mask: false,
          requireDecimal: false,
          spellcheck: true,
          type: "number",
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
