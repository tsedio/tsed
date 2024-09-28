import {CollectionOf, getJsonSchema, getSpec, In, Name, OperationPath, Path, Property, Required, Returns, SpecTypes} from "../../index.js";
import {ForwardGroups} from "./forwardGroups.js";
import {Groups} from "./groups.js";

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
  @ForwardGroups()
  prop4: ChildModel[];
}

describe("@ForwardGroups", () => {
  describe("JsonSchema", () => {
    it("should display fields when a group match with (creation)", () => {
      const spec = getJsonSchema(MyModel, {
        groups: ["creation"]
      });

      expect(spec).toEqual({
        definitions: {
          ChildModelCreation: {
            properties: {
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
          prop3: {
            minLength: 1,
            type: "string"
          },
          prop4: {
            items: {
              $ref: "#/definitions/ChildModelCreation"
            },
            type: "array"
          }
        },
        required: ["prop3"],
        type: "object"
      });
    });
  });
  describe("OpenSpec", () => {
    it("should display fields when a group match with (OS3)", () => {
      @Path("/")
      class MyController {
        @OperationPath("POST", "/")
        @(Returns(201, MyModel).Groups("group.*"))
        create(@In("body") @Groups("creation") payload: MyModel) {
          return Promise.resolve(new MyModel());
        }

        @OperationPath("PUT", "/:id")
        @Returns(200, MyModel)
        update(@In("body") @Groups("group.*") payload: MyModel, @In("path") @Name("id") id: string) {
          return Promise.resolve(new MyModel());
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
            ChildModelCreation: {
              properties: {
                prop1: {
                  minLength: 1,
                  type: "string"
                }
              },
              required: ["prop1"],
              type: "object"
            },
            ChildModelGroup: {
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
            MyModel: {
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
              required: ["prop3"],
              type: "object"
            },
            MyModelCreation: {
              properties: {
                prop3: {
                  minLength: 1,
                  type: "string"
                },
                prop4: {
                  items: {
                    $ref: "#/components/schemas/ChildModelCreation"
                  },
                  type: "array"
                }
              },
              required: ["prop3"],
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
                    $ref: "#/components/schemas/ChildModelGroup"
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
            post: {
              operationId: "myControllerCreate",
              parameters: [],
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/MyModelCreation"
                    }
                  }
                },
                required: false
              },
              responses: {
                "201": {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/MyModelGroup"
                      }
                    }
                  },
                  description: "Created"
                }
              },
              tags: ["MyController"]
            }
          },
          "/{id}": {
            put: {
              operationId: "myControllerUpdate",
              parameters: [
                {
                  in: "path",
                  name: "id",
                  required: true,
                  schema: {
                    type: "string"
                  }
                }
              ],
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/MyModelGroup"
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
                        $ref: "#/components/schemas/MyModel"
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
  });
});
