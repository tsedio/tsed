import {CollectionOf} from "@tsed/schema";

import {getFormioSchema} from "../src/index.js";

describe("Array", () => {
  it("should declare array string", async () => {
    class Model {
      @CollectionOf(String)
      test: string[];
    }

    expect(await getFormioSchema(Model)).toEqual({
      components: [
        {
          disabled: false,
          input: true,
          key: "test",
          label: "Test",
          multiple: true,
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
      type: "form",
      submissionAccess: [],
      access: [],
      tags: []
    });
  });
  it("should declare array number", async () => {
    class Model {
      @CollectionOf(Number)
      test: number[];
    }

    expect(await getFormioSchema(Model)).toEqual({
      components: [
        {
          delimiter: false,
          disabled: false,
          input: true,
          inputFormat: "plain",
          label: "Test",
          key: "test",
          mask: false,
          multiple: true,
          requireDecimal: false,
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
  it("should declare array boolean", async () => {
    class Model {
      @CollectionOf(Boolean)
      test: boolean[];
    }

    expect(await getFormioSchema(Model)).toEqual({
      components: [
        {
          disabled: false,
          input: true,
          key: "test",
          multiple: true,
          type: "checkbox",
          label: "Test",
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
