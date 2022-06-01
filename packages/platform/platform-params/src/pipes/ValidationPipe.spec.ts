import {PlatformTest, Post} from "@tsed/common";
import {catchAsyncError} from "@tsed/core";
import {CollectionOf, getSpec, JsonParameterStore, Required, SpecTypes} from "@tsed/schema";
import {BodyParams} from "../decorators/bodyParams";
import {QueryParams} from "../decorators/queryParams";
import {ValidationPipe} from "./ValidationPipe";

describe("ValidationPipe", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should return value (Body)", async () => {
    const validator = await PlatformTest.invoke<ValidationPipe>(ValidationPipe);
    // @ts-ignore
    validator.validator = undefined;

    class Test {
      @Post("/")
      test(@BodyParams(String) type: string[]) {}
    }

    // WHEN
    const param = JsonParameterStore.get(Test, "test", 0);
    const result = await validator.transform("value", param);
    // THEN
    expect(getSpec(Test, {specType: SpecTypes.OPENAPI})).toEqual({
      paths: {
        "/": {
          post: {
            operationId: "testTest",
            parameters: [],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    items: {
                      type: "string"
                    },
                    type: "array"
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
    expect(result).toEqual("value");
  });
  it("should return value (Query required)", async () => {
    const validator = await PlatformTest.invoke<ValidationPipe>(ValidationPipe);
    // @ts-ignore
    validator.validator = undefined;

    class Test {
      @Post("/")
      test(@QueryParams("test") @Required() @CollectionOf(String) type: string[]) {}
    }

    // WHEN
    const param = JsonParameterStore.get(Test, "test", 0);

    const result: any = await validator.transform(["test"], param);

    // THEN
    expect(getSpec(Test, {specType: SpecTypes.OPENAPI})).toEqual({
      paths: {
        "/": {
          post: {
            operationId: "testTest",
            parameters: [
              {
                in: "query",
                name: "test",
                required: true,
                schema: {
                  items: {
                    type: "string"
                  },
                  type: "array"
                }
              }
            ],
            responses: {
              "200": {
                description: "Success"
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

    expect(result).toEqual(["test"]);
  });
  it("should throw an error (Query required)", async () => {
    const validator = await PlatformTest.invoke<ValidationPipe>(ValidationPipe);
    // @ts-ignore
    validator.validator = undefined;

    class Test {
      @Post("/")
      test(@QueryParams("test") @Required() @CollectionOf(String) type: string[]) {}
    }

    // WHEN
    const param = JsonParameterStore.get(Test, "test", 0);

    const result: any = await catchAsyncError(() => validator.transform(undefined, param));

    // THEN
    expect(getSpec(Test, {specType: SpecTypes.OPENAPI})).toEqual({
      paths: {
        "/": {
          post: {
            operationId: "testTest",
            parameters: [
              {
                in: "query",
                name: "test",
                required: true,
                schema: {
                  items: {
                    type: "string"
                  },
                  type: "array"
                }
              }
            ],
            responses: {
              "200": {
                description: "Success"
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

    expect(result.message).toEqual("It should have required parameter 'test'");
  });
});
