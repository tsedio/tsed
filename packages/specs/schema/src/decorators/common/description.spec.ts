import {In, OperationPath, Property, SpecTypes} from "@tsed/schema";
import {expect} from "chai";
import {getJsonSchema} from "../../utils/getJsonSchema";
import {getSpec} from "../../utils/getSpec";
import {Description} from "./description";

describe("@Description", () => {
  it("should declare description on class", () => {
    // WHEN
    @Description("Description")
    class Model {}

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
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
    expect(getSpec(Model)).to.deep.equal({
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
    expect(getJsonSchema(Model)).to.deep.equal({
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
    expect(getSpec(Model)).to.deep.equal({
      tags: [
        {
          name: "Model"
        }
      ],
      paths: {
        "/": {
          get: {
            operationId: "modelMethod",
            parameters: [
              {
                description: "Description",
                in: "query",
                required: false,
                type: "string"
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
      }
    });
  });
  it("should declare description on params (BODY)", () => {
    // WHEN
    class MyModel {
      @Property()
      id: string;
    }

    class MyController {
      @OperationPath("POST", "/")
      method(@In("body") @Description("Description") payload: MyModel) {}
    }

    // THEN
    expect(getSpec(MyController)).to.deep.equal({
      definitions: {
        MyModel: {
          properties: {
            id: {
              type: "string"
            }
          },
          type: "object"
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
            parameters: [
              {
                in: "body",
                name: "body",
                required: false,
                description: "Description",
                schema: {
                  $ref: "#/definitions/MyModel"
                }
              }
            ],
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
    expect(spec).to.deep.equal({
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
  it("should throw error when the decorator isn't used with a supported decorator type", () => {
    // WHEN
    let actualError: any;
    try {
      class Model {
        constructor(@Description("Description") param: string) {}
      }
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError.message).to.deep.equal("Description cannot be used as parameter.constructor decorator on Model");
  });
});
