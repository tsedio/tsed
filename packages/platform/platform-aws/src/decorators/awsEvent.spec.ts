import {Controller, Get, ParamMetadata, ParamTypes} from "@tsed/common";
import {getSpec} from "@tsed/schema";
import {expect} from "chai";
import {AwsEvent} from "./awsEvent";

describe("AwsEvent", () => {
  it("should get event object", () => {
    @Controller("/")
    class MyController {
      @Get("/")
      get(@AwsEvent() event: any) {}
    }

    const param = ParamMetadata.get(MyController, "get", 0);
    expect(param.expression).to.eq("x-apigateway-event");
    expect(param.paramType).to.eq(ParamTypes.HEADER);
  });

  it("should generate the right spec", () => {
    @Controller("/")
    class MyController {
      @Get("/")
      get(@AwsEvent() event: any) {}
    }

    expect(getSpec(MyController)).to.deep.eq({
      paths: {
        "/": {
          get: {
            operationId: "myControllerGet",
            parameters: [
              {
                description: "x-apigateway-event serialized Json",
                in: "header",
                name: "x-apigateway-event",
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
