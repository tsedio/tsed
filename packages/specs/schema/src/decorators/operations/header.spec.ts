import {getSpec, OperationPath, SpecTypes} from "@tsed/schema";
import {Header} from "./header";

describe("Header", () => {
  describe("when is used as method decorator", () => {
    describe("with one params has object", () => {
      it("should set Header", () => {
        class MyController {
          @Header({"Content-Type": "application/json"})
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
                  "200": {
                    content: {
                      "*/*": {
                        schema: {
                          type: "object"
                        }
                      }
                    },
                    headers: {
                      "Content-Type": {
                        example: "application/json",
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
    describe("with two params has object", () => {
      it("should set Header", () => {
        class MyController {
          @OperationPath("GET", "/")
          @Header("Content-Type", "application/json")
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
                  "200": {
                    content: {
                      "*/*": {
                        schema: {
                          type: "object"
                        }
                      }
                    },
                    headers: {
                      "Content-Type": {
                        example: "application/json",
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
    describe("with swagger params has object", () => {
      it("should set Header", () => {
        class MyController {
          @OperationPath("GET", "/")
          @Header({
            "Content-Type": "text/plain",
            "Content-Length": 123,
            ETag: {
              value: "12345",
              description: "header description"
            }
          } as any)
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
                  "200": {
                    content: {
                      "*/*": {
                        schema: {
                          type: "object"
                        }
                      }
                    },
                    headers: {
                      "Content-Length": {
                        example: 123,
                        schema: {
                          type: "number"
                        }
                      },
                      "Content-Type": {
                        example: "text/plain",
                        schema: {
                          type: "string"
                        }
                      },
                      ETag: {
                        description: "header description",
                        example: "12345",
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
  });
});
