import {Property} from "@tsed/schema";

import {getFormioSchema} from "../src/index.js";

describe("Object", () => {
  it("should declare object", async () => {
    class Model {
      @Property()
      test: any;
    }

    expect(await getFormioSchema(Model)).toEqual({
      access: [],
      components: [
        {
          disabled: false,
          input: true,
          key: "test",
          label: "Test",
          tableView: false,
          type: "datamap",
          validate: {
            required: false
          },
          valueComponent: {
            hideLabel: true,
            tableView: true
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
