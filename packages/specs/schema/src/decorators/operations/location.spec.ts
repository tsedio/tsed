import {getSpec, Location, OperationPath, SpecTypes} from "@tsed/schema";
import {expect} from "chai";

describe("Location", () => {
  it("should set Header", () => {
    class MyController {
      @(Location("/path/to/test", {description: "Path to next step"}).Status(301))
      @OperationPath("GET", "/")
      test() {}
    }

    const spec = getSpec(MyController, {spec: SpecTypes.SWAGGER});

    expect(spec).to.deep.eq({
      paths: {
        "/": {
          get: {
            operationId: "myControllerTest",
            parameters: [],
            responses: {
              "301": {
                description: "Moved Permanently",
                headers: {
                  Location: {
                    description: "Path to next step",
                    example: "/path/to/test",
                    type: "string"
                  }
                },
                schema: {
                  type: "object"
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
