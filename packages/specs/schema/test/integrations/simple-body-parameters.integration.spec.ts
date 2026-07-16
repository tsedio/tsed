import {JsonParameterStore, Post, Required, compile} from "../../src/index.js";
import {ParamTypes, UseParam} from "@tsed/platform-params";

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

    expect(compile(Model)).toEqual({
      properties: {
        id: {
          minLength: 1,
          type: "string"
        }
      },
      required: ["id"],
      type: "object"
    });
    expect(compile(metadata)).toEqual({
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
