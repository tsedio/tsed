import {BodyParams} from "@tsed/platform-params";

import {validateSpec} from "../../../test/helpers/validateSpec.js";
import {SpecTypes} from "../../domain/SpecTypes.js";
import {getJsonSchema} from "../../utils/getJsonSchema.js";
import {getSpec} from "../../utils/getSpec.js";
import {OperationPath} from "../operations/operationPath.js";
import {Path} from "../operations/path.js";
import {Returns} from "../operations/returns.js";
import {Integer} from "./integer.js";

describe("@Integer", () => {
  it("should generate the right json schema", () => {
    // WHEN
    class Model {
      @Integer()
      prop: number;
    }

    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop: {
          multipleOf: 1,
          type: "integer"
        }
      },
      type: "object"
    });
  });

  it("should generate the right json schema (array)", () => {
    // WHEN
    class Model {
      @Integer()
      prop: number[];
    }

    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop: {
          items: {
            multipleOf: 1,
            type: "integer"
          },
          type: "array"
        }
      },
      type: "object"
    });
  });

  it("should generate the OS3", async () => {
    @Path("/")
    class TestIntegerCtrl {
      @OperationPath("GET", "/")
      @(Returns(200, Array).OfInteger())
      async get(@BodyParams() @Integer() number: number[]) {}
    }

    const spec = getSpec(TestIntegerCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      paths: {
        "/": {
          get: {
            operationId: "testIntegerCtrlGet",
            parameters: [],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    items: {
                      multipleOf: 1,
                      type: "integer"
                    },
                    type: "array"
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
                      items: {
                        multipleOf: 1,
                        type: "integer"
                      },
                      type: "array"
                    }
                  }
                },
                description: "Success"
              }
            },
            tags: ["TestIntegerCtrl"]
          }
        }
      },
      tags: [
        {
          name: "TestIntegerCtrl"
        }
      ]
    });
    expect(await validateSpec(spec, SpecTypes.OPENAPI)).toBe(true);
  });
});
