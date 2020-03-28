import {getSpec, OperationPath} from "@tsed/schema";
import {expect} from "chai";
import {Summary} from "./summary";

describe("Summary", () => {
  it("should store metadata", () => {
    class MyController {
      @OperationPath("POST", "/")
      @Summary("summary")
      get() {}
    }

    expect(getSpec(MyController)).to.deep.eq({
      definitions: {},
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
                description: ""
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

    expect(actualError.message).to.deep.eq("Summary cannot be used as class decorator on Test");
  });
});
