import {ContentType, getSpec, OperationPath} from "@tsed/schema";
import {expect} from "chai";

describe("ContentType", () => {
  it("should create middleware", () => {
    class Test {
      @OperationPath("GET", "/")
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
