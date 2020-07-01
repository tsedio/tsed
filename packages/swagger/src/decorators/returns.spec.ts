import {Get} from "@tsed/common";
import {getSpec} from "@tsed/schema";
import {expect} from "chai";
import {Returns} from "./returns";

class Test {}

describe("Returns()", () => {
  describe("when status and configuration are given", () => {
    it("should set the responses", () => {
      class Ctrl {
        @Get("/")
        @Returns(400, {
          description: "Bad Request"
        })
        test() {}
      }

      const spec = getSpec(Ctrl);

      expect(spec).to.deep.eq({
        definitions: {},
        paths: {
          "/": {
            get: {
              operationId: "ctrlTest",
              parameters: [],
              responses: {
                "400": {
                  description: "Bad Request",
                  schema: {
                    type: "string"
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

  describe("when status and model are given", () => {
    before(() => {});
    it("should set the responses", () => {
      class Ctrl {
        @Returns(200, Test)
        test() {}
      }

      const endpoint = EndpointMetadata.get(Ctrl, "test");

      expect(endpoint.responses.get(200)).to.deep.eq({
        code: 200,
        description: "",
        type: Test
      });
    });
  });

  describe("when a type and configuration are given", () => {
    it("should set the responses", () => {
      class Ctrl {
        @Get("/")
        @Returns(Test, {
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
                    $ref: "#/definitions/Test"
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
        @Returns(Test)
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
                    $ref: "#/definitions/Test"
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
        @Returns({
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
                    $ref: "#/definitions/Test"
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
