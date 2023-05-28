import {getSpec, In, JsonEntityStore, Name, OperationPath, Path, SpecTypes} from "../../index";

describe("In", () => {
  it("should declare all schema correctly (param)", () => {
    // WHEN
    class Controller {
      method(@In("path") @Name("basic") basic: string) {}
    }

    // THEN
    getSpec(Controller, {
      specType: SpecTypes.SWAGGER
    });

    const paramSchema = JsonEntityStore.from(Controller, "method", 0);
    const methodSchema = paramSchema.parent;
    const operation = methodSchema.operation!.toJSON({});

    expect(operation).toEqual({
      parameters: [
        {
          in: "path",
          name: "basic",
          required: true,
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        "200": {
          description: "Success"
        }
      }
    });
  });
  it("should declare all schema correctly (method)", () => {
    // WHEN
    class Controller {
      @In("header").Type(String).Name("Authorization").Required().Description("description")
      method(@In("path") @Name("basic") basic: string) {}
    }

    // THEN
    getSpec(Controller, {
      specType: SpecTypes.SWAGGER
    });

    const paramSchema = JsonEntityStore.from(Controller, "method", 0);
    const methodSchema = paramSchema.parent;
    const operation = methodSchema.operation!.toJSON({});

    expect(operation).toEqual({
      parameters: [
        {
          in: "path",
          name: "basic",
          required: true,
          schema: {
            type: "string"
          }
        },
        {
          description: "description",
          in: "header",
          name: "Authorization",
          required: true,
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        "200": {
          description: "Success"
        }
      }
    });
  });
  it("should declare all schema correctly (class)", () => {
    // WHEN
    class Controller {
      @In("header").Type(String).Name("Authorization").Required().Description("description")
      method(@In("path") @Name("basic") basic: string) {}
    }

    // THEN
    getSpec(Controller, {
      specType: SpecTypes.SWAGGER
    });

    const paramSchema = JsonEntityStore.from(Controller, "method", 0);
    const methodSchema = paramSchema.parent;
    const operation = methodSchema.operation!.toJSON({});

    expect(operation).toEqual({
      parameters: [
        {
          in: "path",
          name: "basic",
          required: true,
          schema: {
            type: "string"
          }
        },
        {
          description: "description",
          in: "header",
          name: "Authorization",
          required: true,
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        "200": {
          description: "Success"
        }
      }
    });
  });
  it("should extra schema", () => {
    // WHEN
    @Path("/:parentId")
    @In("path")
      .Type(String)
      .Name("parentId")
      .Required()
      .Description("description")
      .Pattern(/^[0-9a-fA-F]{24}$/)
    class Controller {
      @OperationPath("GET", "/:path")
      method(@In("path") @Name("basic") basic: string) {}
    }

    // THEN
    const spec = getSpec(Controller, {
      specType: SpecTypes.OPENAPI
    });

    const paramSchema = JsonEntityStore.from(Controller, "method", 0);
    const methodSchema = paramSchema.parent;
    const operation = methodSchema.operation!.toJSON({
      specType: SpecTypes.OPENAPI
    });

    expect(operation).toEqual({
      parameters: [
        {
          in: "path",
          name: "basic",
          required: true,
          schema: {
            type: "string"
          }
        },
        {
          description: "description",
          in: "path",
          name: "parentId",
          required: true,
          schema: {
            pattern: "^[0-9a-fA-F]{24}$",
            type: "string"
          }
        }
      ],
      responses: {
        "200": {
          description: "Success"
        }
      }
    });
    expect(spec).toEqual({
      paths: {
        "/{parentId}/{path}": {
          get: {
            operationId: "controllerMethod",
            parameters: [
              {
                description: "description",
                in: "path",
                name: "parentId",
                required: true,
                schema: {
                  type: "string",
                  pattern: "^[0-9a-fA-F]{24}$"
                }
              },
              {
                in: "path",
                name: "path",
                required: true,
                schema: {
                  type: "string"
                }
              }
            ],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["Controller"]
          }
        }
      },
      tags: [
        {
          name: "Controller"
        }
      ]
    });
  });
  it("should throw error for unsupported usage", () => {
    class Test {
      test() {}
    }

    let actualError: any;
    try {
      // @ts-ignore
      In("tags")(Test.prototype, "test");
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).toEqual("In cannot be used as property decorator on Test.test");
  });
});
