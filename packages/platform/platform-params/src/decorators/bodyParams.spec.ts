import {Controller} from "@tsed/di";
import {getSpec, JsonParameterStore, Post, SpecTypes} from "@tsed/schema";

import {ParamTypes} from "../domain/ParamTypes.js";
import {BodyParams, RawBodyParams} from "./bodyParams.js";

describe("@BodyParams", () => {
  it("should call useParam method with the correct parameters", () => {
    class Test {}

    class Ctrl {
      test(@BodyParams("expression", Test) body: Test) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.BODY);
    expect(param.type).toEqual(Test);
  });
  it("should create params with Buffer type", () => {
    @Controller("/")
    class MyCtrl {
      @Post()
      test(@BodyParams() body: Buffer) {}
    }

    const spec = getSpec(MyCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      paths: {
        "/": {
          post: {
            operationId: "myCtrlTest",
            parameters: [],
            requestBody: {
              content: {
                "*/*": {
                  schema: {
                    type: "string"
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
            tags: ["MyCtrl"]
          }
        }
      },
      tags: [
        {
          name: "MyCtrl"
        }
      ]
    });
  });
});

describe("RawBodyParams()", () => {
  it("should declare a RawBodyParams", () => {
    @Controller("/")
    class MyCtrl {
      @Post()
      test(@RawBodyParams() body: Buffer) {}
    }

    const spec = getSpec(MyCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      paths: {
        "/": {
          post: {
            operationId: "myCtrlTest",
            parameters: [],
            requestBody: {
              content: {
                "*/*": {
                  schema: {
                    type: "string"
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
            tags: ["MyCtrl"]
          }
        }
      },
      tags: [
        {
          name: "MyCtrl"
        }
      ]
    });

    const param = JsonParameterStore.get(MyCtrl, "test", 0);
    expect(param.paramType).toEqual(ParamTypes.RAW_BODY);
    expect(param.type).toEqual(Buffer);
    expect(param.pipes).toHaveLength(0);
  });
  it("should declare RawBodyParams with options", () => {
    class Ctrl {
      test(@RawBodyParams({useValidation: true, useType: String}) param: Date) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual(undefined);
    expect(param.paramType).toEqual(ParamTypes.RAW_BODY);
    expect(param.type).toEqual(String);
    expect(param.pipes).toHaveLength(1);
  });
});
