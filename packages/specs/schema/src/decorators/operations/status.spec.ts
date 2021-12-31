import {OperationPath, SpecTypes, Status} from "@tsed/schema";
import "@tsed/platform-exceptions";
import {getSpec} from "../../utils/getSpec";

describe("@Status", () => {
  it("should declare a return type", async () => {
    // WHEN
    class Controller {
      @OperationPath("POST", "/")
      @(Status(200, String).Description("description"))
      method() {}
    }

    // THEN
    const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      paths: {
        "/": {
          post: {
            operationId: "controllerMethod",
            parameters: [],
            responses: {
              "200": {
                content: {
                  "*/*": {
                    schema: {
                      type: "string"
                    }
                  }
                },
                description: "description"
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
