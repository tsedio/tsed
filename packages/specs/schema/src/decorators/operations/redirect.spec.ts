import {getSpec, OperationPath, SpecTypes} from "@tsed/schema";
import {Redirect} from "./redirect";

describe("Redirect", () => {
  it("should set header with path only", () => {
    class MyController {
      @Redirect("/path/to")
      @OperationPath("GET", "/")
      test() {}
    }

    const spec = getSpec(MyController, {spec: SpecTypes.SWAGGER});

    expect(spec).toEqual({
      paths: {
        "/": {
          get: {
            operationId: "myControllerTest",
            parameters: [],
            responses: {
              "302": {
                description: "Found",
                headers: {
                  Location: {
                    example: "/path/to",
                    type: "string"
                  }
                },
                schema: {
                  type: "object"
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

    const spec = getSpec(MyController, {spec: SpecTypes.SWAGGER});

    expect(spec).toEqual({
      paths: {
        "/": {
          get: {
            operationId: "myControllerTest",
            parameters: [],
            responses: {
              "301": {
                description: "Moved Permanently",
                headers: {
                  Location: {
                    example: "/path/to",
                    type: "string"
                  }
                },
                schema: {
                  type: "object"
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

    const spec = getSpec(MyController, {spec: SpecTypes.SWAGGER});

    expect(spec).toEqual({
      paths: {
        "/": {
          get: {
            operationId: "myControllerTest",
            parameters: [],
            responses: {
              "301": {
                description: "Moved Permanently",
                headers: {
                  Location: {
                    description: "Test description",
                    example: "/path/to",
                    type: "string"
                  }
                },
                schema: {
                  type: "object"
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
