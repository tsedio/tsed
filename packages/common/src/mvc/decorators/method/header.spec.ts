import {getSpec, SpecTypes} from "@tsed/schema";
import {expect} from "chai";
import {Get} from "../../../../src/mvc";
import {Header, mapHeaders} from "./header";

describe("mapHeaders", () => {
  it("should map headers", () => {
    expect(
      mapHeaders({
        header1: 1,
        header2: "content",
        header3: {
          value: "content2",
          type: "string"
        }
      } as any)
    ).to.deep.eq({
      header1: {value: 1, type: "number"},
      header2: {value: "content", type: "string"},
      header3: {
        value: "content2",
        type: "string"
      }
    });
  });
});

describe("Header", () => {
  describe("when is used as method decorator", () => {
    describe("with one params has object", () => {
      it("should set Header", () => {
        class MyController {
          @Header({"Content-Type": "application/json"})
          @Get("/")
          test() {}
        }

        const spec = getSpec(MyController, {spec: SpecTypes.SWAGGER});

        expect(spec).to.deep.eq({
          definitions: {},
          paths: {
            "/": {
              get: {
                operationId: "myControllerTest",
                parameters: [],
                "produces": [
                  "text/json"
                ],
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
          @Get("/")
          @Header("Content-Type", "application/json")
          test() {
          }
        }

        const spec = getSpec(MyController, {spec: SpecTypes.SWAGGER});

        expect(spec).to.deep.eq({
          definitions: {},
          paths: {
            "/": {
              get: {
                operationId: "myControllerTest",
                parameters: [],
                "produces": [
                  "text/json"
                ],
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
          @Get("/")
          @Header({
            "Content-Type": "text/plain",
            "Content-Length": 123,
            ETag: {
              value: "12345",
              description: "header description"
            }
          } as any)
          test() {
          }
        }

        const spec = getSpec(MyController, {spec: SpecTypes.SWAGGER});

        expect(spec).to.deep.eq({
          definitions: {},
          paths: {
            "/": {
              get: {
                operationId: "myControllerTest",
                parameters: [],
                "produces": [
                  "text/json"
                ],
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
