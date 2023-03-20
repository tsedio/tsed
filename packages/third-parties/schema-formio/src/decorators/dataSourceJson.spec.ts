import {getFormioSchema} from "../utils/getFormioSchema";
import {DataSourceJson} from "./dataSourceJson";
import {Select} from "./select";

describe("DataSourceJson", () => {
  it("should declare datasource", async () => {
    class Model {
      @Select()
      @DataSourceJson([
        {
          id: "id",
          value: "value"
        }
      ])
      test: string;
    }

    expect(await getFormioSchema(Model)).toEqual({
      components: [
        {
          data: {
            json: '[{"id":"id","value":"value"}]'
          },
          dataSrc: "json",
          disabled: false,
          input: true,
          label: "Test",
          key: "test",
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
  it("should declare datasource from resolver", async () => {
    class Model {
      @Select()
      @DataSourceJson(() => [
        {
          id: "id",
          value: "value"
        }
      ])
      test: string;
    }

    expect(await getFormioSchema(Model)).toEqual({
      components: [
        {
          data: {
            json: '[{"id":"id","value":"value"}]'
          },
          dataSrc: "json",
          disabled: false,
          input: true,
          label: "Test",
          key: "test",
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
});
