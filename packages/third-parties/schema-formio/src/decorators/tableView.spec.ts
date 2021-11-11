import {getFormioSchema, TableView} from "@tsed/schema-formio";

describe("@TableView", () => {
  it("should change the table view option", async () => {
    class Model {
      @TableView(false)
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
          tableView: false,
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
