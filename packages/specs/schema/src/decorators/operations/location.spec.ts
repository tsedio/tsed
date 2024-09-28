import {getSpec, Location, OperationPath, SpecTypes} from "../../index.js";

describe("Location", () => {
  it("should set Header", () => {
    class MyController {
      @(Location("/path/to/test", {description: "Path to next step"}).Status(301))
      @OperationPath("GET", "/")
      test() {}
    }

    const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      paths: {
        "/": {
          get: {
            operationId: "myControllerTest",
            parameters: [],
            responses: {
              "301": {
                content: {
                  "*/*": {
                    schema: {
                      type: "object"
                    }
                  }
                },
                description: "Moved Permanently",
                headers: {
                  Location: {
                    description: "Path to next step",
                    example: "/path/to/test",
                    schema: {
                      type: "string"
                    }
                  }
                }
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
