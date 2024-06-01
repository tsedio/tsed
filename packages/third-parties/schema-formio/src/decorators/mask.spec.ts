import {getFormioSchema} from "../utils/getFormioSchema.js";
import {Mask, Masks} from "./mask.js";

describe("@Mask", () => {
  it("should add a mask on field (1)", async () => {
    class Model {
      @Mask("(99999)", "____")
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
          inputMask: "(99999)",
          inputMaskPlaceholderChar: "____",
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
  it("should add a mask on field (2)", async () => {
    class Model {
      @Mask("(99999)")
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
          inputMask: "(99999)",
          inputMaskPlaceholderChar: "",
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

describe("@Masks", () => {
  it("should add masks on field", async () => {
    class Model {
      @Masks({label: "label", mask: "mask"})
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
          inputMasks: [
            {
              label: "label",
              mask: "mask"
            }
          ],
          type: "textfield",
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
