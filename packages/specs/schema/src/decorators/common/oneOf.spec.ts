import {AllOf, getJsonSchema, getSpec, In, OneOf, OperationPath, Path, Property, SpecTypes} from "@tsed/schema";
import {expect} from "chai";
import {number, string} from "../../utils/from";

describe("@OneOf", () => {
  it("should declare return schema", () => {
    // WHEN
    class Model {
      @OneOf(string(), number())
      num: string;
    }

    // THEN
    const schema = getJsonSchema(Model);

    expect(schema).to.deep.equal({
      properties: {
        num: {
          oneOf: [
            {
              type: "string"
            },
            {
              type: "number"
            }
          ]
        }
      },
      type: "object"
    });
  });
  it("should declare two models", () => {
    class One1 {
      @Property()
      id: string;
    }

    class One2 {
      @Property()
      id: string;
    }

    class Model {
      @OneOf(One1, One2)
      test: One1 | One2;
    }

    const schema = getJsonSchema(Model);

    expect(schema).to.deep.eq({
      definitions: {
        One1: {
          type: "object",
          properties: {
            id: {
              type: "string"
            }
          }
        },
        One2: {
          type: "object",
          properties: {
            id: {
              type: "string"
            }
          }
        }
      },
      properties: {
        test: {
          oneOf: [
            {
              $ref: "#/definitions/One1"
            },
            {
              $ref: "#/definitions/One2"
            }
          ]
        }
      },
      type: "object"
    });
  });
  it("should declare two models - OS3", () => {
    class One1 {
      @Property()
      id: string;
    }

    class One2 {
      @Property()
      id: string;
    }

    class Model {
      @OneOf(One1, One2)
      test: One1 | One2;
    }

    @Path("/")
    class MyController {
      @OperationPath("POST", "/")
      get(@In("body") payload: Model) {}
    }

    const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

    expect(spec).to.deep.eq({
      components: {
        schemas: {
          Model: {
            properties: {
              test: {
                oneOf: [
                  {
                    $ref: "#/components/schemas/One1"
                  },
                  {
                    $ref: "#/components/schemas/One2"
                  }
                ]
              }
            },
            type: "object"
          },
          One1: {
            properties: {
              id: {
                type: "string"
              }
            },
            type: "object"
          },
          One2: {
            properties: {
              id: {
                type: "string"
              }
            },
            type: "object"
          }
        }
      },
      paths: {
        "/": {
          post: {
            operationId: "myControllerGet",
            parameters: [],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Model"
                  }
                }
              },
              required: false
            },
            responses: {
              "200": {
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
  it("should declare two models (array) - OS3", () => {
    class One1 {
      @Property()
      id: string;
    }

    class One2 {
      @Property()
      id: string;
    }

    class Model {
      @OneOf(One1, One2)
      list: (One1 | One2)[];
    }

    @Path("/")
    class MyController {
      @OperationPath("POST", "/")
      get(@In("body") payload: Model) {}
    }

    const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

    expect(spec).to.deep.eq({
      components: {
        schemas: {
          Model: {
            properties: {
              list: {
                type: "array",
                items: {
                  oneOf: [
                    {
                      $ref: "#/components/schemas/One1"
                    },
                    {
                      $ref: "#/components/schemas/One2"
                    }
                  ]
                }
              }
            },
            type: "object"
          },
          One1: {
            properties: {
              id: {
                type: "string"
              }
            },
            type: "object"
          },
          One2: {
            properties: {
              id: {
                type: "string"
              }
            },
            type: "object"
          }
        }
      },
      paths: {
        "/": {
          post: {
            operationId: "myControllerGet",
            parameters: [],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Model"
                  }
                }
              },
              required: false
            },
            responses: {
              "200": {
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
