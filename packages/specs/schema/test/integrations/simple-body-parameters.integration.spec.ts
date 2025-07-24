import {ParamTypes, UseParam} from "@tsed/platform-params";

import {getJsonSchema, JsonParameterStore, Post, Required} from "../../src/index.js";

describe("Simple body parameters integration", () => {
  it("should generate the json schema", () => {
    class Model {
      @Required()
      id: string;
    }

    class Ctrl {
      @Post("/")
      get(@UseParam({paramType: ParamTypes.BODY}) value: Model) {}
    }

    const metadata = JsonParameterStore.get(Ctrl, "get", 0);

    expect(getJsonSchema(Model)).toEqual({
      properties: {
        id: {
          minLength: 1,
          type: "string"
        }
      },
      required: ["id"],
      type: "object"
    });
    expect(getJsonSchema(metadata)).toEqual({
      type: "object",
      properties: {
        id: {
          minLength: 1,
          type: "string"
        }
      },
      required: ["id"]
    });
  });
});
