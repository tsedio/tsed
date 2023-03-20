import {getSpec, OperationPath} from "../../index";
import {Summary} from "./summary";

describe("Summary", () => {
  it("should store metadata", () => {
    class MyController {
      @OperationPath("POST", "/")
      @Summary("summary")
      get() {}
    }

    expect(getSpec(MyController)).toEqual({
      tags: [
        {
          name: "MyController"
        }
      ],
      paths: {
        "/": {
          post: {
            operationId: "myControllerGet",
            parameters: [],
            responses: {
              "200": {
                description: "Success"
              }
            },
            summary: "summary",
            tags: ["MyController"]
          }
        }
      }
    });
  });
  it("should throw error for unsupported usage", () => {
    let actualError: any;
    try {
      Summary("summary")(class Test {});
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).toEqual("Summary cannot be used as class decorator on Test");
  });
});
