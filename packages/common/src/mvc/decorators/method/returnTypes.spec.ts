import {Get} from "@tsed/common";
import {getSpec} from "@tsed/schema";
import {expect} from "chai";
import {ReturnType} from "./returnType";

describe("ReturnType", () => {
  it("should store metadata (when code is given)", () => {
    // GIVEN
    class TypeC {}

    // WHEN
    class Test {
      @Get("/")
      @ReturnType({
        code: 200,
        type: TypeC,
        collectionType: Array,
        headers: {
          // @ts-ignore
          "x-header": {
            value: "test"
          }
        },
        description: "Description",
        schema: {
          minItems: 0
        },
        examples: {test: "examples"}
      })
      get() {}
    }

    // THEN
    const spec = getSpec(Test);

    expect(spec).to.deep.eq({
      definitions: {
        TypeC: {
          type: "object"
        }
      },
      paths: {
        "/": {
          get: {
            operationId: "testGet",
            parameters: [],
            produces: ["text/json"],
            responses: {
              "200": {
                description: "Description",
                examples: {
                  test: "examples"
                },
                headers: {
                  "x-header": {
                    example: "test",
                    type: "string"
                  }
                },
                schema: {
                  minItems: 0,
                  items: {
                    $ref: "#/definitions/TypeC"
                  },
                  type: "array"
                }
              }
            },
            tags: ["Test"]
          }
        }
      },
      tags: [
        {
          name: "Test"
        }
      ]
    });
  });
  it("should store metadata (when code is not given)", () => {
    // GIVEN
    class TypeC {}

    // WHEN
    class Test {
      @Get("/")
      @ReturnType({
        type: TypeC,
        collectionType: Array,
        headers: {
          // @ts-ignore
          "x-header": {
            value: "test"
          }
        }
      })
      get() {}
    }

    // THEN
  });
});
