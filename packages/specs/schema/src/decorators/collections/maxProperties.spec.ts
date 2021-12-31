import {getJsonSchema, In, OperationPath, SpecTypes} from "@tsed/schema";
import {getSpec} from "../../utils/getSpec";
import {MaxProperties} from "./maxProperties";

describe("@MaxProperties", () => {
  it("should declare max value (any)", () => {
    // WHEN
    class Model {
      @MaxProperties(10)
      prop: any;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop: {
          maxProperties: 10,
          type: "object"
        }
      },
      type: "object"
    });
  });
  it("should declare max value (Map<any>)", () => {
    // WHEN
    class Model {
      @MaxProperties(10)
      prop: Map<string, any>;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop: {
          maxProperties: 10,
          type: "object"
        }
      },
      type: "object"
    });
  });
  it("should declare max value on class", () => {
    // WHEN
    @MaxProperties(10)
    class Model {}

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      maxProperties: 10,
      type: "object"
    });
  });
  it("should declare max value on param", () => {
    // WHEN
    class MyController {
      @OperationPath("POST", "/")
      method(@In("body") @MaxProperties(10) test: any) {}
    }

    // THEN
    expect(getSpec(MyController, {specType: SpecTypes.OPENAPI})).toEqual({
      paths: {
        "/": {
          post: {
            operationId: "myControllerMethod",
            parameters: [],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    maxProperties: 10,
                    type: "object"
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
  it("should throw an error when the given parameters is as negative integer", () => {
    // WHEN
    let actualError: any;
    try {
      MaxProperties(-1);
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError.message).toBe("The value of maxProperties MUST be a non-negative integer.");
  });
});
