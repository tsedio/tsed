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

    expect(EndpointMetadata.get(Test, "test").afterMiddlewares.length).to.eq(1);

    const spec = getSpec(Test);
    expect(spec).to.deep.eq({
      definitions: {},
      paths: {
        "/": {
          get: {
            operationId: "testTest",
            parameters: [],
            produces: ["application/json"],
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
  });
});
