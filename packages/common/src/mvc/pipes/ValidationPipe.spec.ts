import {ParamMetadata, PlatformTest, Post} from "@tsed/common";
import {catchAsyncError, catchError} from "@tsed/core";
import {CollectionOf, getSpec, Required} from "@tsed/schema";
import {expect} from "chai";
import {BodyParams} from "../decorators/params/bodyParams";
import {QueryParams} from "../decorators/params/queryParams";
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
    const param = ParamMetadata.get(Test, "test", 0);
    const result = await validator.transform("value", param);
    // THEN
    expect(getSpec(Test)).to.deep.eq({
      paths: {
        "/": {
          post: {
            operationId: "testTest",
            parameters: [
              {
                in: "body",
                name: "body",
                required: false,
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
    expect(result).to.deep.eq("value");
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
    const param = ParamMetadata.get(Test, "test", 0);

    const result: any = await validator.transform(["test"], param);

    // THEN
    expect(getSpec(Test)).to.deep.eq({
      paths: {
        "/": {
          post: {
            operationId: "testTest",
            parameters: [
              {
                collectionFormat: "multi",
                in: "query",
                items: {
                  type: "string"
                },
                name: "test",
                required: true,
                type: "array"
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

    expect(result).to.deep.eq(["test"]);
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
    const param = ParamMetadata.get(Test, "test", 0);

    const result: any = await catchAsyncError(() => validator.transform(undefined, param));

    // THEN
    expect(getSpec(Test)).to.deep.eq({
      paths: {
        "/": {
          post: {
            operationId: "testTest",
            parameters: [
              {
                collectionFormat: "multi",
                in: "query",
                items: {
                  type: "string"
                },
                name: "test",
                required: true,
                type: "array"
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

    expect(result.message).to.deep.eq("It should have required parameter 'test'");
  });
});
