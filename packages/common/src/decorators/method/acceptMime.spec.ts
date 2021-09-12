import {AcceptMime, EndpointMetadata, Get} from "@tsed/common";
import {getSpec} from "@tsed/schema";
import {expect} from "chai";

describe("AcceptMime", () => {
  it("should set metadata", () => {
    class Test {
      @Get("/")
      @AcceptMime("application/json")
      test() {}
    }

    const endpoint = EndpointMetadata.get(Test, "test");
    expect(endpoint.acceptMimes).to.deep.eq(["application/json"]);

    const spec = getSpec(Test);

    expect(spec).to.deep.eq({
      paths: {
        "/": {
          get: {
            produces: ["application/json"],
            operationId: "testTest",
            parameters: [],
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
