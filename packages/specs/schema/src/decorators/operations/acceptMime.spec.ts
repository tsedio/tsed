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
    expect(endpoint.operation.get("produces")).toEqual(["application/json"]);
  });

  it("should map the mime to produces (response), not consumes (requestBody)", () => {
    class Test {
      @Get("/")
      @AcceptMime("application/xml")
      test(@BodyParams() model: Model) {}
    }

    const endpoint = JsonMethodStore.get(Test, "test");

    // The client's `Accept` header must contain the format described by
    // `AcceptMime`, so the server must produce a response in that format.
    expect(endpoint.acceptMimes).toEqual(["application/xml"]);
    expect(endpoint.operation.get("produces")).toEqual(["application/xml"]);
    expect(endpoint.operation.get("consumes")).toBeUndefined();

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
