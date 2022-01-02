import {Controller, Get, ParamTypes} from "@tsed/common";
import {getSpec, JsonParameterStore, SpecTypes} from "@tsed/schema";
import {expect} from "chai";
import {AwsContext} from "./awsContext";

describe("AwsContext", () => {
  it("should get event object", () => {
    @Controller("/")
    class MyController {
      @Get("/")
      get(@AwsContext() event: any) {}
    }

    const param = JsonParameterStore.get(MyController, "get", 0);
    expect(param.expression).to.eq("x-apigateway-context");
    expect(param.paramType).to.eq(ParamTypes.HEADER);
  });

  it("should generate the right spec", () => {
    @Controller("/")
    class MyController {
      @Get("/")
      get(@AwsContext() event: any) {}
    }

    expect(getSpec(MyController, {specType: SpecTypes.OPENAPI})).to.deep.eq({
      paths: {
        "/": {
          get: {
            operationId: "myControllerGet",
            parameters: [
              {
                description: "x-apigateway-context serialized Json",
                in: "header",
                name: "x-apigateway-context",
                required: false,
                schema: {type: "string"}
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
      },
      tags: [
        {
          name: "MyController"
        }
      ]
    });
  });
});
