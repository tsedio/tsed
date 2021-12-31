import {getSpec, In, SpecTypes, string} from "../src";
import {OperationPath, Path} from "../src/decorators";
import {validateSpec} from "./helpers/validateSpec";

@Path("/dynamic")
class TestDynamicUrlCtrl {
  @OperationPath("GET", "/JQ=:id")
  async get(@In("path").Name("id") id: string) {

  }
}

describe("Spec: DynamicUrl", () => {
  it("should generate the OS3", async () => {
    const spec = getSpec(TestDynamicUrlCtrl, { specType: SpecTypes.OPENAPI });

    expect(spec).toEqual({
      "paths": {
        "/dynamic/JQ={id}": {
          "get": {
            "operationId": "testDynamicUrlCtrlGet",
            "parameters": [
              {
                "in": "path",
                "name": "id",
                "required": true,
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Success"
              }
            },
            "tags": [
              "TestDynamicUrlCtrl"
            ]
          }
        }
      },
      "tags": [
        {
          "name": "TestDynamicUrlCtrl"
        }
      ]
    });
    expect(await validateSpec(spec)).toBe(true);
  });
});
