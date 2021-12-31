import {getJsonSchema, getSpec, OperationPath, Path, Returns, SpecTypes} from "@tsed/schema";
import {WriteOnly} from "./writeOnly";

describe("@WriteOnly", () => {
  it("should declare writeOnly field (with boolean)", () => {
    // WHEN
    class Model {
      @WriteOnly(true)
      num: string;
    }

    // THEN
    const schema = getJsonSchema(Model);

    expect(schema).toEqual({
      properties: {
        num: {
          writeOnly: true,
          type: "string"
        }
      },
      type: "object"
    });
  });
  it("should declare writeOnly field (default value)", () => {
    // WHEN
    class Model {
      @WriteOnly()
      num: string;
    }

    // THEN
    const schema = getJsonSchema(Model);

    expect(schema).toEqual({
      properties: {
        num: {
          writeOnly: true,
          type: "string"
        }
      },
      type: "object"
    });
  });

  it("should return the spec (OS2)", () => {
    // WHEN
    class Model {
      @WriteOnly(true)
      num: string;
    }

    @Path("/")
    class MyController {
      @OperationPath("GET", "/")
      @Returns(200, Model)
      get() {}
    }

    // THEN
    const spec = getSpec(MyController);

    expect(spec).toEqual({
      definitions: {
        Model: {
          properties: {
            num: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      paths: {
        "/": {
          get: {
            operationId: "myControllerGet",
            parameters: [],
            produces: ["application/json"],
            responses: {
              "200": {
                description: "Success",
                schema: {
                  $ref: "#/definitions/Model"
                }
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
  it("should return the spec (OS3)", () => {
    // WHEN
    class Model {
      @WriteOnly(true)
      num: string;
    }

    @Path("/")
    class MyController {
      @OperationPath("GET", "/")
      @Returns(200, Model)
      get() {}
    }

    // THEN
    const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      components: {
        schemas: {
          Model: {
            properties: {
              num: {
                type: "string",
                writeOnly: true
              }
            },
            type: "object"
          }
        }
      },
      paths: {
        "/": {
          get: {
            operationId: "myControllerGet",
            parameters: [],
            responses: {
              "200": {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Model"
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
