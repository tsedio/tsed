import {getFormioSchema} from "../utils/getFormioSchema.js";
import {HideWhen, ShowWhen} from "./conditional.js";

describe("@Conditional", () => {
  it("should add conditional rule on field (show)", async () => {
    class Model {
      @ShowWhen("test2", 1)
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
          conditional: {
            eq: 1,
            show: true,
            when: "test2"
          },
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
  it("should add conditional rule on field (hide)", async () => {
    class Model {
      @HideWhen("test2", 1)
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
          conditional: {
            eq: 1,
            show: false,
            when: "test2"
          },
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
