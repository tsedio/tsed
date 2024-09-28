import {Enum} from "@tsed/schema";

import {getFormioSchema} from "../utils/getFormioSchema.js";
import {Select} from "./select.js";

describe("Select", () => {
  it("should declare a model with select field", async () => {
    class Model {
      @Select()
      test: string;
    }

    expect(await getFormioSchema(Model)).toEqual({
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
      type: "form",
      submissionAccess: [],
      access: [],
      tags: []
    });
  });
  it("should with enum", async () => {
    enum MyEnum {
      TEST1 = "TEST1",
      TEST2 = "TEST2"
    }

    class Model {
      @Select()
      @Enum(MyEnum)
      test: MyEnum;
    }

    expect(await getFormioSchema(Model)).toEqual({
      access: [],
      components: [
        {
          data: {
            json: '[{"label":"TEST1","value":"TEST1"},{"label":"TEST2","value":"TEST2"}]'
          },
          dataSrc: "json",
          disabled: false,
          idPath: "value",
          input: true,
          key: "test",
          label: "Test",
          selectThreshold: 0.3,
          template: "<span>{{ item.label }}</span>",
          type: "select",
          validate: {
            required: false
          },
          valueProperty: "value",
          widget: "choicesjs"
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
