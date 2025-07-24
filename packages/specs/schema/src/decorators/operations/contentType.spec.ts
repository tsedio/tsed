import {ContentType, getSpec, OperationPath, SpecTypes} from "../../index.js";

describe("ContentType", () => {
  it("should create middleware", () => {
    class Test {
      @OperationPath("GET", "/")
      @ContentType("application/json")
      test() {}
    }

    const spec = getSpec(Test, {specType: SpecTypes.OPENAPI});
    expect(spec).toEqual({
      paths: {
        "/": {
          get: {
            operationId: "testTest",
            parameters: [],
            responses: {
              "200": {
                content: {
                  "application/json": {
                    schema: {}
                  }
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
