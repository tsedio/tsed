import {DataSourceUrl, getFormioSchema, Select} from "@tsed/schema-formio";

describe("@DataSourceUrl", () => {
  it("should declare datasource url", async () => {
    class Model {
      @Select()
      @DataSourceUrl("https://domain.com/api/datasource")
      test: string;
    }

    expect(await getFormioSchema(Model)).toEqual({
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
      type: "form",
      submissionAccess: [],
      access: [],
      tags: []
    });
  });
  it("should declare datasource url with a resolver", async () => {
    class Model {
      @Select()
      @DataSourceUrl(({env}) => `/datasource?env=${env}`)
      test: string;
    }

    const schema1 = await getFormioSchema(Model, {env: "integ"});

    expect(schema1).toEqual({
      components: [
        {
          data: {
            url: "/datasource?env=integ"
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
      type: "form",
      submissionAccess: [],
      access: [],
      tags: []
    });

    const schema2 = await getFormioSchema(Model, {env: "staging"});

    expect(schema2).toEqual({
      components: [
        {
          data: {
            url: "/datasource?env=staging"
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
      type: "form",
      submissionAccess: [],
      access: [],
      tags: []
    });
  });
});
