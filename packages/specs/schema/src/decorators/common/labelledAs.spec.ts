import {getJsonSchema} from "../../utils/getJsonSchema.js";
import {MaxItems} from "../collections/maxItems.js";
import {Enum} from "./enum.js";
import {LabelledAs} from "./labelledAs.js";

describe("LabelledAs", () => {
  it("should create label on item schema", () => {
    enum Test {
      VALUE = "VALUE",
      TEST = "TEST"
    }

    class Model {
      @Enum(Test)
      @MaxItems(3)
      @LabelledAs("ModelPropItem")
      prop: Test[];
    }

    const schema = getJsonSchema(Model);

    expect(schema).toMatchInlineSnapshot(`
      {
        "definitions": {
          "ModelPropItem": {
            "enum": [
              "VALUE",
              "TEST",
            ],
            "type": "string",
          },
        },
        "properties": {
          "prop": {
            "items": {
              "$ref": "#/definitions/ModelPropItem",
            },
            "maxItems": 3,
            "type": "array",
          },
        },
        "type": "object",
      }
    `);
  });
  it("should create label on collection", () => {
    enum Test {
      VALUE = "VALUE",
      TEST = "TEST"
    }

    class Model {
      @Enum(Test)
      @MaxItems(3)
      @LabelledAs("ModelPropItem", "collection")
      prop: Test[];
    }

    const schema = getJsonSchema(Model);

    expect(schema).toMatchInlineSnapshot(`
      {
        "definitions": {
          "ModelPropItem": {
            "items": {
              "enum": [
                "VALUE",
                "TEST",
              ],
              "type": "string",
            },
            "maxItems": 3,
            "type": "array",
          },
        },
        "properties": {
          "prop": {
            "$ref": "#/definitions/ModelPropItem",
          },
        },
        "type": "object",
      }
    `);
  });
});
