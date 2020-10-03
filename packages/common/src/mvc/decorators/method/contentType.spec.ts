import {ContentType, EndpointMetadata, Get} from "@tsed/common";
import {getSpec} from "@tsed/schema";
import {expect} from "chai";

describe("ContentType", () => {
  it("should create middleware", () => {
    class Test {
      @Get("/")
      @ContentType("application/json")
      test() {}
    }

    const spec = getSpec(Test);
    expect(spec).to.deep.eq({
      paths: {
        "/": {
          get: {
            operationId: "testTest",
            parameters: [],
            produces: ["application/json"],
            responses: {
              "200": {
                schema: {
                  type: "object"
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
});
