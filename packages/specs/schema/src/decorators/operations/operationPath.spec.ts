import {getSpec, OperationMethods, OperationPath} from "@tsed/schema";
import {expect} from "chai";

describe("OperationPath", () => {
  it("should store metadata", () => {
    class MyController {
      @OperationPath(OperationMethods.OPTIONS, "/")
      options() {}
    }

    expect(getSpec(MyController)).to.deep.eq({
      tags: [
        {
          name: "MyController"
        }
      ],
      paths: {
        "/": {
          options: {
            operationId: "myControllerOptions",
            parameters: [],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["MyController"]
          }
        }
      }
    });
  });
  it("should throw error for unsupported usage", () => {
    let actualError: any;
    try {
      OperationPath("GET", "/")(class Test {});
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).to.deep.eq("OperationPath cannot be used as class decorator on Test");
  });
});
