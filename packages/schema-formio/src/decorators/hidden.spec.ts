import {getFormioSchema, Hidden} from "@tsed/schema-formio";
import {expect} from "chai";

describe("Hidden", () => {
  it("should declare a model with Hidden field", () => {
    class Model {
      @Hidden()
      test: string;
    }

    expect(getFormioSchema(Model)).to.deep.eq({
      components: [
        {
          disabled: false,
          hidden: true,
          input: true,
          key: "test",
          label: "Test",
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
