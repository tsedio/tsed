import {getFormioSchema} from "@tsed/schema-formio";
import {CustomConditional} from "./customConditional";

describe("@CustomConditional", () => {
  it("should add a custom conditional rule on field (1)", async () => {
    class Model {
      @CustomConditional(({value}) => value === 1)
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
          type: "textfield",
          customConditional: "show = value === 1",
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
  it("should add a custom conditional rule on field (2)", async () => {
    class Model {
      @CustomConditional((ctx) => ctx.value === 1)
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
          type: "textfield",
          customConditional: "show = value === 1",
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
  it("should add a custom conditional rule on field (3)", async () => {
    class Model {
      @CustomConditional("show = value === 1")
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
          type: "textfield",
          customConditional: "show = value === 1",
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
