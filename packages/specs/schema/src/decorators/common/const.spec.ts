import {SpecTypes} from "../../domain/SpecTypes.js";
import {getJsonSchema} from "../../utils/getJsonSchema.js";
import {getSpec} from "../../utils/getSpec.js";
import {In} from "../operations/in.js";
import {OperationPath} from "../operations/operationPath.js";
import {Path} from "../operations/path.js";
import {Const} from "./const.js";

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
          type: "string",
          enum: [
            "10"
          ]
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
      get(@In("body") payload: Model) {
      }
    }

    const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      components: {
        schemas: {
          Model: {
            properties: {
              num: {
                type: "string",
                enum: [
                  "10"
                ]
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
