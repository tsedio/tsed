import {Property} from "@tsed/schema";
import {getFormioSchema} from "../src";

describe("String", () => {
  it("should generate the correct schema", () => {
    class Model {
      @Property()
      test: string;
    }

    const form = getFormioSchema(Model, {groups: ["group1"]});

    expect(form).toEqual({
      "components": [
        {
          "disabled": false,
          "input": true,
          "key": "test",
          "label": "Test",
          "type": "textfield",
          "validate": {
            "required": false
          }
        }
      ],
      "display": "form",
      "machineName": "model",
      "name": "model",
      "title": "Model",
      "type": "form"
    });
  });
});
