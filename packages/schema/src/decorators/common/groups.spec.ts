import {CollectionOf, getJsonSchema, getSpec, In, Name, OperationPath, Path, Property, Required, Returns, SpecTypes} from "@tsed/schema";
import {expect} from "chai";
import {Groups} from "./groups";

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

describe("@Groups", () => {
  describe("JsonSchema", () => {
    it("should show fields with group annotation", () => {
      const spec = getJsonSchema(MyModel, {
        groups: false
      });

      expect(spec).to.deep.equal({
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
              $ref: "#/definitions/ChildModel"
            },
            type: "array"
          }
        },
        required: ["prop1", "prop2", "prop3"],
        type: "object"
      });
    });
    it("should show fields with group annotation if the an empty array is given to group fields", () => {
      const spec = getJsonSchema(MyModel, {
        groups: []
      });

      expect(spec).to.deep.equal({
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
    });

    it("should show fields with group annotation if the an empty any groups is given", () => {
      const spec = getJsonSchema(MyModel);

      expect(spec).to.deep.equal({
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
    });

    it("should display fields when a group match with (group.summary)", () => {
      const spec = getJsonSchema(MyModel, {
        groups: ["group.summary"]
      });

      expect(spec).to.deep.equal({
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
          prop1: {
            minLength: 1,
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
        required: ["prop1", "prop3"],
        type: "object"
      });
    });

    it("should display fields when a group match with (creation)", () => {
      const spec = getJsonSchema(MyModel, {
        groups: ["creation"]
      });

      expect(spec).to.deep.equal({
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
    });

    it("should display fields when a group match with (pattern)", () => {
      const spec = getJsonSchema(MyModel, {
        groups: ["group.*"]
      });

      expect(spec).to.deep.equal({
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
              $ref: "#/definitions/ChildModel"
            },
            type: "array"
          }
        },
        required: ["prop1", "prop2", "prop3"],
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
        async create(@In("body") @Groups("creation") payload: MyModel) {
          return new MyModel();
        }

        @OperationPath("PUT", "/:id")
        @Returns(200, MyModel)
        async update(@In("body") @Groups("group.*") payload: MyModel, @In("path") @Name("id") id: string) {
          return new MyModel();
        }
      }

      const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

      expect(spec).to.deep.equal({
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
                    $ref: "#/components/schemas/ChildModel"
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
    it("should display fields when a group match with (array - OS3)", () => {
      @Path("/")
      class MyController {
        @OperationPath("POST", "/")
        @(Returns(201, Array).Of(MyModel).Groups("group.*"))
        async createWithArray(@In("body") @Groups("creation") @CollectionOf(MyModel) payload: MyModel[]) {
          return [new MyModel()];
        }
      }

      const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

      expect(spec).to.deep.equal({
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
            MyModelCreation: {
              properties: {
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
            post: {
              operationId: "myControllerCreateWithArray",
              parameters: [],
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      items: {
                        $ref: "#/components/schemas/MyModelCreation"
                      },
                      type: "array"
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
                        items: {
                          $ref: "#/components/schemas/MyModelGroup"
                        },
                        type: "array"
                      }
                    }
                  },
                  description: "Created"
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
