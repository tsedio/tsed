import {getFormioSchema, Textarea} from "@tsed/schema-formio";
import {expect} from "chai";

describe("Textarea", () => {
  it("should declare a model with Textarea field", () => {
    class Model {
      @Textarea()
      test: string;
    }

    expect(getFormioSchema(Model)).to.deep.eq({
      components: [
        {
          autoExpand: false,
          disabled: false,
          input: true,
          label: "Test",
          key: "test",
          type: "textarea",
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
