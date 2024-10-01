import {Get, getSpec, Returns, SpecTypes} from "@tsed/schema";

describe("@Returns", () => {
  it("should declare a return type (text/plain)", () => {
    // WHEN
    class Controller {
      @Get("/")
      @(Returns(200, String).ContentType("text/plain"))
      method() {}
    }

    // THEN
    const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      paths: {
        "/": {
          get: {
            operationId: "controllerMethod",
            parameters: [],
            responses: {
              "200": {
                content: {
                  "text/plain": {
                    schema: {
                      type: "string"
                    }
                  }
                },
                description: "Success"
              }
            },
            tags: ["Controller"]
          }
        }
      },
      tags: [
        {
          name: "Controller"
        }
      ]
    });
  });
});
