import {isArrowFn, Type, useDecorators} from "@tsed/core";
import {getJsonSchema, JsonEntityFn, lazyRef, Property, string} from "@tsed/schema";
import {expect} from "chai";

function Ref(model: string | (() => Type) | any): PropertyDecorator {
  const getType = () => isArrowFn(model) ? model() : model;

  return useDecorators(
    Property(Object),
    JsonEntityFn(async (store) => {
      store.itemSchema.oneOf([string().example("5ce7ad3028890bd71749d477").description("Mongoose Ref ObjectId"), lazyRef(getType)]);

      store.type = Object;
    })
  ) as PropertyDecorator;
}

class Model {
  @Property()
  id: string;
}

class Parent {
  @Ref(() => Model)
  model: Model;
}


describe("LazyRef", () => {
  it("should generate the spec with lazy loaded ref", () => {
    expect(getJsonSchema(Parent)).to.deep.eq({
      "definitions": {
        "Model": {
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "type": "object"
        }
      },
      "properties": {
        "model": {
          "oneOf": [
            {
              "description": "Mongoose Ref ObjectId",
              "examples": [
                "5ce7ad3028890bd71749d477"
              ],
              "type": "string"
            },
            {
              "$ref": "#/definitions/Model"
            }
          ]
        }
      },
      "type": "object"
    });
  });
});
