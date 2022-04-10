import {expect} from "chai";
import {Controller} from "@tsed/di";
import {getSpec, JsonParameterStore, Post, SpecTypes} from "@tsed/schema";
import {ParamTypes} from "../domain/ParamTypes";
import {BodyParams, RawBodyParams} from "./bodyParams";

describe("@BodyParams", () => {
  it("should call useParam method with the correct parameters", () => {
    class Test {}

    class Ctrl {
      test(@BodyParams("expression", Test) body: Test) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).to.eq("expression");
    expect(param.paramType).to.eq(ParamTypes.BODY);
    expect(param.type).to.eq(Test);
  });
  it("should create a raw body params", () => {
    @Controller("/")
    class MyCtrl {
      @Post()
      test(@BodyParams() body: Buffer) {}
    }

    const spec = getSpec(MyCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).to.deep.eq({
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

  describe("RawBodyParams()", () => {
    it("should create a raw body params", () => {
      @Controller("/")
      class MyCtrl {
        @Post()
        test(@RawBodyParams() body: Buffer) {}
      }

      const spec = getSpec(MyCtrl, {specType: SpecTypes.OPENAPI});

      expect(spec).to.deep.eq({
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
});
