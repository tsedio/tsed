import {BodyParams} from "@tsed/platform-params";

import {Get, getSpec, JsonMethodStore, Property, SpecTypes} from "../../index.js";
import {AcceptMime} from "./acceptMime.js";

class Model {
  @Property()
  id: string;
}

describe("AcceptMime", () => {
  it("should set metadata", () => {
    class Test {
      @Get("/")
      @AcceptMime("application/json")
      test(@BodyParams() model: Model) {}
    }

    const endpoint = JsonMethodStore.get(Test, "test");
    expect(endpoint.acceptMimes).toEqual(["application/json"]);

    const spec = getSpec(Test, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      components: {
        schemas: {
          Model: {
            properties: {
              id: {
                type: "string"
              }
            },
            type: "object"
          }
        }
      },
      paths: {
        "/": {
          get: {
            operationId: "testTest",
            parameters: [],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Model"
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
