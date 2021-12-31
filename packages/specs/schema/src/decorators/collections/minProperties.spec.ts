import {getJsonSchema, In, OperationPath} from "@tsed/schema";
import {getSpec} from "../../utils/getSpec";
import {MinProperties} from "./minProperties";

describe("@MinProperties", () => {
  it("should declare min value (any)", () => {
    // WHEN
    class Model {
      @MinProperties(10)
      prop: any;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop: {
          minProperties: 10,
          type: "object"
        }
      },
      type: "object"
    });
  });
  it("should declare min value (Map<any>)", () => {
    // WHEN
    class Model {
      @MinProperties(10)
      prop: Map<string, any>;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop: {
          minProperties: 10,
          type: "object"
        }
      },
      type: "object"
    });
  });
  it("should declare min value on class", () => {
    // WHEN
    @MinProperties(10)
    class Model {}

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      minProperties: 10,
      type: "object"
    });
  });
  it("should declare min value on param", () => {
    // WHEN
    class MyController {
      @OperationPath("POST", "/")
      method(@In("body") @MinProperties(10) test: any) {}
    }

    // THEN
    expect(getSpec(MyController)).toEqual({
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
                schema: {
                  minProperties: 10,
                  type: "object"
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
  it("should throw an error when the given parameters is as negative integer", () => {
    // WHEN
    let actualError: any;
    try {
      MinProperties(-1);
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError.message).toBe("The value of minProperties MUST be a non-negative integer.");
  });
});
