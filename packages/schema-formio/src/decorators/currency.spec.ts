import {Currency, getFormioSchema} from "@tsed/schema-formio";
import {expect} from "chai";

describe("Currency", () => {
  it("should declare currency", () => {
    class Model {
      @Currency()
      test: number;
    }

    expect(getFormioSchema(Model)).to.deep.eq({
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
      type: "form"
    });
  });
});
