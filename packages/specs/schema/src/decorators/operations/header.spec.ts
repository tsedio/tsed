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

        const spec = getSpec(MyController, {spec: SpecTypes.SWAGGER});

        expect(spec).toEqual({
          paths: {
            "/": {
              get: {
                operationId: "myControllerTest",
                parameters: [],
                responses: {
                  "200": {
                    headers: {
                      "Content-Type": {
                        type: "string",
                        example: "application/json"
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
    describe("with two params has object", () => {
      it("should set Header", () => {
        class MyController {
          @OperationPath("GET", "/")
          @Header("Content-Type", "application/json")
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
                  "200": {
                    headers: {
                      "Content-Type": {
                        type: "string",
                        example: "application/json"
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

        const spec = getSpec(MyController, {spec: SpecTypes.SWAGGER});

        expect(spec).toEqual({
          paths: {
            "/": {
              get: {
                operationId: "myControllerTest",
                parameters: [],
                responses: {
                  "200": {
                    headers: {
                      "Content-Length": {
                        type: "number",
                        example: 123
                      },
                      "Content-Type": {
                        type: "string",
                        example: "text/plain"
                      },
                      ETag: {
                        description: "header description",
                        type: "string",
                        example: "12345"
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
  });
});
