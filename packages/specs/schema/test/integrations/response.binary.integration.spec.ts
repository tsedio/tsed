import {QueryParams} from "@tsed/platform-params";

import {getSpec, OperationPath, Path, Property, Returns, SpecTypes} from "../../src/index.js";
import {validateSpec} from "../helpers/validateSpec.js";

@Path("/responses")
class TestResponseCtrl {
  @OperationPath("GET", "/:id")
  @(Returns(200).Binary())
  async scenario1(@QueryParams("id") id: string) {}
}

describe("Spec: Response", () => {
  it("should generate the", async () => {
    const spec = getSpec(TestResponseCtrl);

    expect(spec).toEqual({
      paths: {
        "/responses/{id}": {
          get: {
            operationId: "testResponseCtrlScenario1",
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                schema: {
                  type: "string"
                }
              },
              {
                in: "query",
                name: "id",
                required: false,
                schema: {
                  type: "string"
                }
              }
            ],
            responses: {
              "200": {
                content: {
                  "application/octet-stream": {
                    schema: {
                      format: "binary",
                      type: "string"
                    }
                  }
                },
                description: "Success"
              }
            },
            tags: ["TestResponseCtrl"]
          }
        }
      },
      tags: [
        {
          name: "TestResponseCtrl"
        }
      ]
    });
    expect(await validateSpec(spec, SpecTypes.OPENAPI)).toBe(true);
  });
});
