import {Property} from "@tsed/schema";
import {expect} from "chai";
import {getFormioSchema} from "../src";

describe("String", () => {
  it("should generate the correct schema", () => {
    class Model {
      @Property()
      test: string;
    }

    const form = getFormioSchema(Model, {groups: ["group1"]});

    expect(form).to.deep.eq({
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
