import {Ajv} from "ajv";

import {
  CollectionOf,
  getJsonSchema,
  getSpec,
  Groups,
  In,
  OperationPath,
  Path,
  Property,
  Required,
  Returns,
  SpecTypes
} from "../../index.js";
import {Partial} from "./partial.js";

class ChildModel {
  @Groups("!creation")
  id: string;

  @Required()
  prop1: string;
}

class MyModel {
  @Groups("!creation")
  id: string;

  @Groups("group.summary")
  @Required()
  prop1: string;

  @Groups("group.extended")
  @Required()
  prop2: string;

  @Property()
  @Required()
  prop3: string;

  @CollectionOf(ChildModel)
  prop4: ChildModel[];
}

describe("@Partial", () => {
  describe("OpenSpec", () => {
    it("should display fields when a group match with (OS3)", () => {
      @Path("/")
      class MyController {
        @OperationPath("PATCH", "/")
        @(Returns(200, MyModel).Groups("group.*"))
        patch(@In("body") @Partial() payload: MyModel) {
          return new MyModel();
        }
      }

      const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

      expect(spec).toEqual({
        components: {
          schemas: {
            ChildModel: {
              properties: {
                id: {
                  type: "string"
                },
                prop1: {
                  minLength: 1,
                  type: "string"
                }
              },
              required: ["prop1"],
              type: "object"
            },
            MyModelPartial: {
              properties: {
                id: {
                  type: "string"
                },
                prop3: {
                  minLength: 1,
                  type: "string"
                },
                prop4: {
                  items: {
                    $ref: "#/components/schemas/ChildModel"
                  },
                  type: "array"
                }
              },
              type: "object"
            },
            MyModelGroup: {
              properties: {
                id: {
                  type: "string"
                },
                prop1: {
                  minLength: 1,
                  type: "string"
                },
                prop2: {
                  minLength: 1,
                  type: "string"
                },
                prop3: {
                  minLength: 1,
                  type: "string"
                },
                prop4: {
                  items: {
                    $ref: "#/components/schemas/ChildModel"
                  },
                  type: "array"
                }
              },
              required: ["prop1", "prop2", "prop3"],
              type: "object"
            }
          }
        },
        paths: {
          "/": {
            patch: {
              operationId: "myControllerPatch",
              parameters: [],
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/MyModelPartial"
                    }
                  }
                },
                required: false
              },
              responses: {
                "200": {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/MyModelGroup"
                      }
                    }
                  },
                  description: "Success"
                }
              },
              tags: ["MyController"]
            }
          }
        },
        tags: [
          {
            name: "MyController"
          }
        ]
      });
    });
    it("should return a valid json-schema", () => {
      const schema = getJsonSchema(MyModel, {});

      expect(schema).toEqual({
        definitions: {
          ChildModel: {
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["prop1"],
            type: "object"
          }
        },
        properties: {
          id: {
            type: "string"
          },
          prop3: {
            minLength: 1,
            type: "string"
          },
          prop4: {
            items: {
              $ref: "#/definitions/ChildModel"
            },
            type: "array"
          }
        },
        required: ["prop3"],
        type: "object"
      });

      const ajv = new Ajv({strict: true});

      expect(ajv.validate(schema, {})).toBe(false);
      expect(ajv.validate(schema, {prop3: "test"})).toBe(true);
    });
    it("should return a valid json-schema (partial)", () => {
      const schema = getJsonSchema(MyModel, {
        groups: ["partial"]
      });

      expect(schema).toEqual({
        definitions: {
          ChildModel: {
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["prop1"],
            type: "object"
          }
        },
        properties: {
          id: {
            type: "string"
          },
          prop3: {
            minLength: 1,
            type: "string"
          },
          prop4: {
            items: {
              $ref: "#/definitions/ChildModel"
            },
            type: "array"
          }
        },
        type: "object"
      });

      const ajv = new Ajv({strict: true});

      expect(ajv.validate(schema, {})).toBe(true);
      expect(ajv.validate(schema, {prop3: "test"})).toBe(true);
    });
  });
});
