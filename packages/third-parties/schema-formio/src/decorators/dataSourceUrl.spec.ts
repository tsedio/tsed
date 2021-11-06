import {DataSourceUrl, getFormioSchema, Select} from "@tsed/schema-formio";

describe("DataSourceUrl", () => {
  it("should declare datasource url", () => {
    class Model {
      @Select()
      @DataSourceUrl("https://domain.com/api/datasource")
      test: string;
    }

    expect(getFormioSchema(Model)).toEqual({
      components: [
        {
          data: {
            url: "https://domain.com/api/datasource"
          },
          dataSrc: "url",
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
