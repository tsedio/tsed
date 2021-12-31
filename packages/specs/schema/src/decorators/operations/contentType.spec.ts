import {ContentType, getSpec, OperationPath} from "@tsed/schema";

describe("ContentType", () => {
  it("should create middleware", () => {
    class Test {
      @OperationPath("GET", "/")
      @ContentType("application/json")
      test() {}
    }

    const spec = getSpec(Test);
    expect(spec).toEqual({
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
