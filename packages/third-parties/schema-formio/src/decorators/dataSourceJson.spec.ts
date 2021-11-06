import {DataSourceJson, getFormioSchema, Select} from "@tsed/schema-formio";

describe("DataSourceJson", () => {
  it("should declare datasource", () => {
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

    expect(getFormioSchema(Model)).toEqual({
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
      type: "form"
    });
  });
});
