import {getFormioSchema, Select} from "@tsed/schema-formio";
import {expect} from "chai";

describe("Select", () => {
  it("should declare a model with select field", () => {
    class Model {
      @Select()
      test: string;
    }

    expect(getFormioSchema(Model)).to.deep.eq({
      components: [
        {
          disabled: false,
          input: true,
          key: "test",
          label: "Test",
          selectThreshold: 0.3,
          type: "select",
          validate: {
            required: false
          },
          widget: "choicesjs"
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
