import {Get} from "@tsed/common";
import {getSpec} from "@tsed/schema";
import {expect} from "chai";
import {ReturnsArray} from "../index";

class Test {}

describe("ReturnsArray()", () => {
  describe("when a type and configuration are given", () => {
    it("should set the responses", () => {
      class Ctrl {
        @Get("/")
        @ReturnsArray(Test, {
          description: "Success"
        })
        test() {}
      }

      const spec = getSpec(Ctrl);
      expect(spec).to.deep.eq({
        definitions: {
          Test: {
            type: "object"
          }
        },
        paths: {
          "/": {
            get: {
              operationId: "ctrlTest",
              parameters: [],
              produces: ["text/json"],
              responses: {
                "200": {
                  description: "Success",
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/definitions/Test"
                    }
                  }
                }
              },
              tags: ["Ctrl"]
            }
          }
        },
        tags: [
          {
            name: "Ctrl"
          }
        ]
      });
    });
  });

  describe("when a type is given", () => {
    it("should set the responses", () => {
      class Ctrl {
        @Get("/")
        @ReturnsArray(Test)
        test() {}
      }

      const spec = getSpec(Ctrl);

      expect(spec).to.deep.eq({
        definitions: {
          Test: {
            type: "object"
          }
        },
        paths: {
          "/": {
            get: {
              operationId: "ctrlTest",
              parameters: [],
              produces: ["text/json"],
              responses: {
                "200": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/definitions/Test"
                    }
                  }
                }
              },
              tags: ["Ctrl"]
            }
          }
        },
        tags: [
          {
            name: "Ctrl"
          }
        ]
      });
    });
  });

  describe("when a configuration is given", () => {
    it("should set the responses", () => {
      class Ctrl {
        @Get("/")
        @ReturnsArray({
          description: "Success",
          type: Test,
          headers: {
            "Content-Type": {
              type: "string"
            }
          }
        })
        test() {}
      }

      const spec = getSpec(Ctrl);

      expect(spec).to.deep.eq({
        definitions: {
          Test: {
            type: "object"
          }
        },
        paths: {
          "/": {
            get: {
              operationId: "ctrlTest",
              parameters: [],
              produces: ["text/json"],
              responses: {
                "200": {
                  description: "Success",
                  headers: {
                    "Content-Type": {
                      example: undefined,
                      type: "string"
                    }
                  },
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/definitions/Test"
                    }
                  }
                }
              },
              tags: ["Ctrl"]
            }
          }
        },
        tags: [
          {
            name: "Ctrl"
          }
        ]
      });
    });
  });
});
