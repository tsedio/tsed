import {getSpec, OperationPath, Path} from "@tsed/schema";
import {expect} from "chai";

describe("Path", () => {
  it("should declare a path", () => {
    @Path("/path")
    class MyController {
      @OperationPath("POST", "/")
      get() {}
    }

    expect(getSpec(MyController)).to.deep.eq({
      tags: [
        {
          name: "MyController"
        }
      ],
      paths: {
        "/path": {
          post: {
            operationId: "myControllerGet",
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
    class Test {
      test() {}
    }

    let actualError: any;
    try {
      Path("/")(Test.prototype, "test", 0);
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).to.deep.eq("Path cannot be used as parameter decorator on Test.test.[0]");
  });
});
