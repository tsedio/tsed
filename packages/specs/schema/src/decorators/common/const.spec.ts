import {SpecTypes} from "../../domain/SpecTypes";
import {getJsonSchema} from "../../utils/getJsonSchema";
import {getSpec} from "../../utils/getSpec";
import {In} from "../operations/in";
import {OperationPath} from "../operations/operationPath";
import {Path} from "../operations/path";
import {Const} from "./const";

describe("@Const", () => {
  it("should declare prop", () => {
    // WHEN
    class Model {
      @Const("10")
      num: string = "10";
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        num: {
          const: "10",
          type: "string"
        }
      },
      type: "object"
    });

    expect(getJsonSchema(Model, {specType: SpecTypes.OPENAPI})).toEqual({
      properties: {
        num: {
          type: "string"
        }
      },
      type: "object"
    });
  });
  it("should declare prop (spec)", () => {
    // WHEN
    class Model {
      @Const("10")
      num: string = "10";
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
              num: {
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
