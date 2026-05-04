import {Consumes, getSpec, OperationPath, Path} from "../../index.js";
import {compile} from "../../utils/compile.js";
import {Name} from "./name.js";

describe("@Name", () => {
  it("should declare name as alias (props)", () => {
    // WHEN
    class Model {
      @Name("num2")
      num: number;
    }

    // THEN
    expect(compile(Model)).toEqual({
      properties: {
        num2: {
          type: "number"
        }
      },
      type: "object"
    });
  });
  it("should declare name on class", () => {
    // WHEN
    @Path("/")
    @Name("AwesomeController")
    class MyController {
      @OperationPath("POST", "/")
      @Consumes("text/json")
      get() {}
    }

    // THEN
    expect(getSpec(MyController)).toEqual({
      paths: {
        "/": {
          post: {
            operationId: "awesomeControllerGet",
            parameters: [],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["AwesomeController"]
          }
        }
      },
      tags: [
        {
          name: "AwesomeController"
        }
      ]
    });
  });
});
