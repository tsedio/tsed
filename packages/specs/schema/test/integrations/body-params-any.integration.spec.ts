import "@tsed/platform-exceptions";

import {Controller} from "@tsed/di";
import {MultipartFile, PlatformMulterFile} from "@tsed/platform-multer";
import {BodyParams} from "@tsed/platform-params";

import {Any, CollectionOf, getSpec, Integer, Post, Property} from "../../src/index.js";

class MyModel {
  @Property()
  test: string;
}

describe("Integration: BodyParams any", () => {
  it("should generate the right spec (any[])", () => {
    @Controller("/array")
    class TestArrayBodyCtrl {
      @Post("/1")
      scenario(@BodyParams() list: any[]) {
        return list;
      }

      @Post("/2")
      scenario2(@BodyParams() list: any) {
        return list;
      }

      @Post("/3")
      scenario3(@BodyParams() @Any() list: any) {
        return list;
      }
    }

    expect(getSpec(TestArrayBodyCtrl)).toMatchSnapshot();
  });
  it("should generate the right spec (any[]) - 3.1.0", () => {
    @Controller("/array")
    class TestArrayBodyCtrl {
      @Post("/3")
      scenario3(@BodyParams() @Any() list: any) {
        return list;
      }
    }

    expect(getSpec(TestArrayBodyCtrl, {specVersion: "3.1.0"})).toMatchInlineSnapshot(`
      {
        "paths": {
          "/array/3": {
            "post": {
              "operationId": "testArrayBodyCtrlScenario3",
              "parameters": [],
              "requestBody": {
                "content": {
                  "application/json": {
                    "schema": {
                      "anyOf": [
                        {
                          "type": "null",
                        },
                        {
                          "multipleOf": 1,
                          "type": "integer",
                        },
                        {
                          "type": "number",
                        },
                        {
                          "type": "string",
                        },
                        {
                          "type": "boolean",
                        },
                        {
                          "items": {},
                          "type": "array",
                        },
                        {
                          "type": "object",
                        },
                      ],
                    },
                  },
                },
                "required": false,
              },
              "responses": {
                "200": {
                  "description": "Success",
                },
              },
              "tags": [
                "TestArrayBodyCtrl",
              ],
            },
          },
        },
        "tags": [
          {
            "name": "TestArrayBodyCtrl",
          },
        ],
      }
    `);
  });
  it("should generate the right spec (number[])", () => {
    @Controller("/array")
    class TestArrayBodyCtrl {
      @Post("/1")
      scenario(@BodyParams() list: number) {
        return list;
      }

      @Post("/2")
      scenario2(@BodyParams(Number) list: number[]) {
        return list;
      }

      @Post("/3")
      scenario3(@BodyParams() @Integer() list: number) {
        return list;
      }

      @Post("/4")
      scenario4(@BodyParams() @Integer() list: number[]) {
        return list;
      }
    }

    expect(getSpec(TestArrayBodyCtrl)).toMatchSnapshot();
  });
  it("should generate the right spec (MyModel[])", () => {
    @Controller("/array")
    class TestArrayBodyCtrl {
      @Post("/1")
      scenario1(@BodyParams() @CollectionOf(MyModel) list: MyModel[]) {
        return list;
      }
    }

    expect(getSpec(TestArrayBodyCtrl)).toMatchSnapshot();
  });
  it("should generate the right spec (File)", () => {
    @Controller("/array")
    class TestArrayBodyCtrl {
      @Post("/")
      scenario(@MultipartFile("file") name: PlatformMulterFile) {
        return undefined;
      }

      @Post("/")
      test(@MultipartFile("file1", 4) file: PlatformMulterFile[]) {}
    }

    expect(getSpec(TestArrayBodyCtrl)).toMatchSnapshot();
  });
});
