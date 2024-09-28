import {BodyParams, RawBodyParams} from "@tsed/platform-params";

import {getSpec, OperationPath, Path, SpecTypes} from "../../src/index.js";
import {validateSpec} from "../helpers/validateSpec.js";

@Path("/body")
class TestBodyCtrl {
  @OperationPath("GET", "/1")
  async scenario1(@BodyParams() id: Buffer) {}

  @OperationPath("GET", "/2")
  async scenario2(@RawBodyParams() id: Buffer) {}
}

describe("Spec: Body", () => {
  it("should generate the", async () => {
    const spec = getSpec(TestBodyCtrl);

    expect(spec).toEqual({
      paths: {
        "/body/1": {
          get: {
            operationId: "testBodyCtrlScenario1",
            parameters: [],
            requestBody: {
              content: {
                "*/*": {
                  schema: {
                    type: "string"
                  }
                }
              },
              required: false
            },
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["TestBodyCtrl"]
          }
        },
        "/body/2": {
          get: {
            operationId: "testBodyCtrlScenario2",
            parameters: [],
            requestBody: {
              content: {
                "*/*": {
                  schema: {
                    type: "string"
                  }
                }
              },
              required: false
            },
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["TestBodyCtrl"]
          }
        }
      },
      tags: [
        {
          name: "TestBodyCtrl"
        }
      ]
    });
    expect(await validateSpec(spec, SpecTypes.OPENAPI)).toBe(true);
  });
});
