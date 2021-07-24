import {getFormioSchema, Multiple} from "@tsed/schema-formio";
import {expect} from "chai";

describe("Multiple", () => {
  it("should declare a model with multiple field", () => {
    class Model {
      @Multiple()
      test: string;
    }

    expect(getFormioSchema(Model)).to.deep.eq({
      components: [
        {
          disabled: false,
          input: true,
          key: "test",
          label: "Test",
          multiple: false,
          type: "textfield",
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
