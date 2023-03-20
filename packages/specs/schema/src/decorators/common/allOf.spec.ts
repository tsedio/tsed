import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {SpecTypes} from "../../domain/SpecTypes";
import {number, string} from "../../utils/from";
import {getJsonSchema} from "../../utils/getJsonSchema";
import {getSpec} from "../../utils/getSpec";
import {In} from "../operations/in";
import {OperationPath} from "../operations/operationPath";
import {Path} from "../operations/path";
import {AllOf} from "./allOf";
import {Property} from "./property";

describe("@AllOf", () => {
  it("should declare return schema", () => {
    // WHEN
    class Model {
      @AllOf(string(), number())
      num: string;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
      properties: {
        num: {
          allOf: [
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
      @AllOf(One1, One2)
      test: One1 | One2;
    }

    const schema = getJsonSchema(Model);

    expect(schema).toEqual({
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
          allOf: [
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
      @AllOf(One1, One2)
      test: One1 | One2;
    }

    @Path("/")
    class MyController {
      @OperationPath("POST", "/")
      get(@In("body") payload: Model) {}
    }

    const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      components: {
        schemas: {
          Model: {
            properties: {
              test: {
                allOf: [
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
      @AllOf(One1, One2)
      list: (One1 | One2)[];
    }

    @Path("/")
    class MyController {
      @OperationPath("POST", "/")
      get(@In("body") payload: Model) {}
    }

    const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      components: {
        schemas: {
          Model: {
            properties: {
              list: {
                type: "array",
                items: {
                  allOf: [
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
