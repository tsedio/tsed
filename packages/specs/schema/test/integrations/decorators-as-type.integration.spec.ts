import {Type} from "@tsed/core";

import {getJsonSchema, Property} from "../../src/index.js";

function Ref(model: string | (() => Type) | any): PropertyDecorator {
  return Property(model) as PropertyDecorator;
}

Ref.$schema = {
  skip: true
};

type Ref<T> = T | string;

describe("Decorators as type", () => {
  describe("A custom decorator is used as a type declaration like Ref<T>", () => {
    it("shouldn't create a reference for the decorator", () => {
      class Test2 {
        @Property()
        id: string;
      }

      class Test {
        @Ref(() => Test2)
        test: Ref<Test2>;
      }

      expect(getJsonSchema(Test)).toMatchInlineSnapshot(`
        {
          "definitions": {
            "Test2": {
              "properties": {
                "id": {
                  "type": "string",
                },
              },
              "type": "object",
            },
          },
          "properties": {
            "test": {
              "$ref": "#/definitions/Test2",
            },
          },
          "type": "object",
        }
      `);
    });
  });
});
