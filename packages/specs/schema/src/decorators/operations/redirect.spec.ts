import {getSpec, OperationPath, SpecTypes} from "../../index.js";
import {Redirect} from "./redirect.js";

describe("Redirect", () => {
  it("should set header with path only", () => {
    class MyController {
      @Redirect("/path/to")
      @OperationPath("GET", "/")
      test() {}
    }

    const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      paths: {
        "/": {
          get: {
            operationId: "myControllerTest",
            parameters: [],
            responses: {
              "302": {
                content: {
                  "*/*": {
                    schema: {
                      type: "object"
                    }
                  }
                },
                description: "Found",
                headers: {
                  Location: {
                    example: "/path/to",
                    schema: {
                      type: "string"
                    }
                  }
                }
              }
            },
            tags: ["MyController"]
          }
        }
      },
      tags: [
        {
          name: "MyController"
        }
      ]
    });
  });
  it("should set header with path and status", () => {
    class MyController {
      @Redirect(301, "/path/to")
      @OperationPath("GET", "/")
      test() {}
    }

    const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      paths: {
        "/": {
          get: {
            operationId: "myControllerTest",
            parameters: [],
            responses: {
              "301": {
                content: {
                  "*/*": {
                    schema: {
                      type: "object"
                    }
                  }
                },
                description: "Moved Permanently",
                headers: {
                  Location: {
                    example: "/path/to",
                    schema: {
                      type: "string"
                    }
                  }
                }
              }
            },
            tags: ["MyController"]
          }
        }
      },
      tags: [
        {
          name: "MyController"
        }
      ]
    });
  });
  it("should set header with path and status and meta", () => {
    class MyController {
      @Redirect(301, "/path/to", {
        description: "Test description"
      })
      @OperationPath("GET", "/")
      test() {}
    }

    const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      paths: {
        "/": {
          get: {
            operationId: "myControllerTest",
            parameters: [],
            responses: {
              "301": {
                content: {
                  "*/*": {
                    schema: {
                      type: "object"
                    }
                  }
                },
                description: "Moved Permanently",
                headers: {
                  Location: {
                    description: "Test description",
                    example: "/path/to",
                    schema: {
                      type: "string"
                    }
                  }
                }
              }
            },
            tags: ["MyController"]
          }
        }
      },
      tags: [
        {
          name: "MyController"
        }
      ]
    });
  });
});
