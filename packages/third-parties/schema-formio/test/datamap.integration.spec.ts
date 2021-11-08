import {CollectionOf} from "@tsed/schema";
import {getFormioSchema} from "../src";


describe("DataMap integration", () => {
  it("should generate form (string)", () => {
    class Model {
      @CollectionOf(String)
      test: Map<string, string>;
    }

    expect(getFormioSchema(Model)).toEqual({
      "components": [
        {
          "disabled": false,
          "input": true,
          "key": "test",
          "label": "Test",
          "tableView": false,
          "type": "datamap",
          "validate": {
            "required": false
          },
          "valueComponent": {
            "disabled": false,
            "hideLabel": true,
            "input": true,
            "tableView": true,
            "type": "textfield"
          }
        }
      ],
      "display": "form",
      "machineName": "model",
      "name": "model",
      "title": "Model",
      "type": "form",
      submissionAccess: [],
      access: [],
      tags: [],
    });
  });
  it("should generate form (number)", () => {
    class Model {
      @CollectionOf(Number)
      test: Map<string, number>;
    }

    expect(getFormioSchema(Model)).toEqual({
      "components": [
        {
          "disabled": false,
          "input": true,
          "key": "test",
          "label": "Test",
          "tableView": false,
          "type": "datamap",
          "validate": {
            "required": false
          },
          "valueComponent": {
            "delimiter": false,
            "disabled": false,
            "hideLabel": true,
            "input": true,
            "inputFormat": "plain",
            "mask": false,
            "requireDecimal": false,
            "tableView": true,
            "type": "number"
          }
        }
      ],
      "display": "form",
      "machineName": "model",
      "name": "model",
      "title": "Model",
      "type": "form",
      submissionAccess: [],
      access: [],
      tags: [],
    });
  });
});
