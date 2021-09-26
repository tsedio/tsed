import {In, OperationPath, Property, SpecTypes} from "@tsed/schema";
import {getJsonSchema} from "../../utils/getJsonSchema";
import {getSpec} from "../../utils/getSpec";
import {Description} from "./description";

describe("@Description", () => {
  it("should declare description on class", () => {
    // WHEN
    @Description("Description")
    class Model {}

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      description: "Description",
      type: "object"
    });
  });
  it("should declare description on method", () => {
    // WHEN

    class Model {
      @OperationPath("GET", "/")
      @Description("Description")
      method() {}
    }

    // THEN
    expect(getSpec(Model)).toEqual({
      paths: {
        "/": {
          get: {
            description: "Description",
            operationId: "modelMethod",
            parameters: [],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["Model"]
          }
        }
      },
      tags: [{name: "Model"}]
    });
  });
  it("should declare description on property", () => {
    // WHEN

    class Model {
      @Description("Description")
      method: string;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        method: {
          description: "Description",
          type: "string"
        }
      },
      type: "object"
    });
  });
  it("should declare description on params (QUERY)", () => {
    // WHEN

    class Model {
      @OperationPath("GET", "/")
      method(@In("query") @Description("Description") query: string) {}
    }

    // THEN
    expect(getSpec(Model, {specType: SpecTypes.OPENAPI})).toEqual({
      paths: {
        "/": {
          get: {
            operationId: "modelMethod",
            parameters: [
              {
                description: "Description",
                in: "query",
                required: false,
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
            tags: ["Model"]
          }
        }
      },
      tags: [
        {
          name: "Model"
        }
      ]
    });
  });
  it("should declare description on params (BODY - openapi3)", () => {
    // WHEN
    class MyModel {
      @Property()
      id: string;
    }

    class MyController {
      @OperationPath("POST", "/")
      method(@In("body") @Description("Description") payload: MyModel) {}
    }

    const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

    // THEN
    expect(spec).toEqual({
      components: {
        schemas: {
          MyModel: {
            properties: {
              id: {
                type: "string"
              }
            },
            type: "object"
          }
        }
      },
      tags: [
        {
          name: "MyController"
        }
      ],
      paths: {
        "/": {
          post: {
            operationId: "myControllerMethod",
            parameters: [],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/MyModel"
                  }
                }
              },
              description: "Description",
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
      }
    });
  });
});
