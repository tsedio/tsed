import {getFormioSchema, Textarea} from "@tsed/schema-formio";

describe("Textarea", () => {
  it("should declare a model with Textarea field", () => {
    class Model {
      @Textarea()
      test: string;
    }

    expect(getFormioSchema(Model)).toEqual({
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
