import {CollectionOf, Generics, OperationPath, Property, Status, SpecTypes} from "@tsed/schema";
import "@tsed/platform-exceptions";
import {getSpec} from "../../utils/getSpec";

describe("@Status", () => {
  it("should declare a return type", async () => {
    // WHEN
    class Controller {
      @OperationPath("POST", "/")
      @Status(200, String).Description("description")
      method() {}
    }

    // THEN
    const spec = getSpec(Controller, {specType: SpecTypes.SWAGGER});

    expect(spec).toEqual({
      tags: [
        {
          name: "Controller"
        }
      ],
      paths: {
        "/": {
          post: {
            operationId: "controllerMethod",
            parameters: [],
            responses: {
              "200": {
                description: "description",
                schema: {
                  type: "string"
                }
              }
            },
            tags: ["Controller"]
          }
        }
      }
    });
  });
  it("should declare a return type (Status().Type())", async () => {
    // WHEN
    class Controller {
      @OperationPath("POST", "/")
      @Status(200).Type(String).Description("description")
      method() {}
    }

    // THEN
    const spec = getSpec(Controller, {specType: SpecTypes.SWAGGER});

    expect(spec).toEqual({
      tags: [
        {
          name: "Controller"
        }
      ],
      paths: {
        "/": {
          post: {
            operationId: "controllerMethod",
            parameters: [],
            responses: {
              "200": {
                description: "description",
                schema: {
                  type: "string"
                }
              }
            },
            tags: ["Controller"]
          }
        }
      }
    });
  });
  it("should declare a return type with headers", async () => {
    // WHEN
    class Controller {
      @OperationPath("POST", "/")
      @Status(200, String)
        .Description("description")
        .Header("x-token", "token")
        .Header("x-header", {
          value: ""
        })
        .Examples({test: "Examples"})
        .Schema({
          minLength: 3
        })
      method() {}
    }

    // THEN
    const spec = getSpec(Controller, {specType: SpecTypes.SWAGGER});

    expect(spec).toEqual({
      tags: [
        {
          name: "Controller"
        }
      ],
      paths: {
        "/": {
          post: {
            operationId: "controllerMethod",
            parameters: [],
            responses: {
              "200": {
                description: "description",
                headers: {
                  "x-header": {
                    example: "",
                    type: "string"
                  },
                  "x-token": {
                    example: "token",
                    type: "string"
                  }
                },
                examples: {test: "Examples"},
                schema: {
                  type: "string",
                  minLength: 3
                }
              }
            },
            tags: ["Controller"]
          }
        }
      }
    });
  });
  it("should declare a return type with content-type", async () => {
    // WHEN
    class Controller {
      @OperationPath("POST", "/")
      @Status(200, String).Description("description").ContentType("text/html").Examples("Examples")
      method() {}
    }

    // THEN
    const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      tags: [
        {
          name: "Controller"
        }
      ],
      paths: {
        "/": {
          post: {
            operationId: "controllerMethod",
            parameters: [],
            responses: {
              "200": {
                content: {
                  "text/html": {
                    schema: {
                      type: "string"
                    },
                    examples: ["Examples"]
                  }
                },
                description: "description"
              }
            },
            tags: ["Controller"]
          }
        }
      }
    });
  });
  it("should declare error response", async () => {
    // WHEN
    class Controller {
      @OperationPath("POST", "/")
      @Status(400).Description("Bad request")
      @Status(401)
      @Status(200).Description("Success")
      method() {}
    }

    // THEN
    const spec = getSpec(Controller, {specType: SpecTypes.SWAGGER});

    expect(spec).toEqual({
      paths: {
        "/": {
          post: {
            operationId: "controllerMethod",
            parameters: [],
            responses: {
              "200": {description: "Success", schema: {type: "object"}},
              "400": {description: "Bad request", schema: {$ref: "#/definitions/BadRequest"}},
              "401": {description: "Unauthorized", schema: {$ref: "#/definitions/Unauthorized"}}
            },
            produces: ["application/json"],
            tags: ["Controller"]
          }
        }
      },
      tags: [{name: "Controller"}],
      definitions: {
        GenericError: {
          additionalProperties: true,
          properties: {
            message: {
              description: "An error message",
              minLength: 1,
              type: "string"
            },
            name: {
              description: "The error name",
              minLength: 1,
              type: "string"
            }
          },
          required: ["name", "message"],
          type: "object"
        },
        Unauthorized: {
          type: "object",
          properties: {
            name: {type: "string", minLength: 1, description: "The error name", example: "UNAUTHORIZED", default: "UNAUTHORIZED"},
            message: {type: "string", minLength: 1, description: "An error message"},
            status: {type: "number", description: "The status code of the exception", example: 401, default: 401},
            errors: {
              type: "array",
              items: {
                $ref: "#/definitions/GenericError"
              },
              description: "A list of related errors"
            },
            stack: {type: "string", description: "The stack trace (only in development mode)"}
          },
          required: ["name", "message", "status"]
        },
        BadRequest: {
          type: "object",
          properties: {
            name: {type: "string", minLength: 1, description: "The error name", example: "BAD_REQUEST", default: "BAD_REQUEST"},
            message: {type: "string", minLength: 1, description: "An error message"},
            status: {type: "number", description: "The status code of the exception", example: 400, default: 400},
            errors: {
              type: "array",
              items: {
                $ref: "#/definitions/GenericError"
              },
              description: "A list of related errors"
            },
            stack: {type: "string", description: "The stack trace (only in development mode)"}
          },
          required: ["name", "message", "status"]
        }
      }
    });
  });
  it("should throw an error when using of with String", async () => {
    // WHEN
    let actualError: any;
    try {
      class Controller {
        @OperationPath("POST", "/")
        @Status(200, String).Of(Array).Description("description")
        method() {}
      }
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).toBe("Returns.Of cannot be used with the following primitive classes: String, Number, Boolean");
  });
  it("should throw an error when using of with Collection", async () => {
    // WHEN
    let actualError: any;
    try {
      class Controller {
        @OperationPath("POST", "/")
        @Status(200, Array).Nested(Set).Description("description")
        method() {}
      }
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).toBe("Returns.Nested cannot be used with the following classes: Map, Set, Array, String, Number, Boolean");
  });
  it("should declare an Array of string", async () => {
    // WHEN
    class Controller {
      @OperationPath("POST", "/")
      @Status(200, Array).Of(String).Description("description")
      method() {}
    }

    // THEN
    const spec = getSpec(Controller, {specType: SpecTypes.SWAGGER});

    expect(spec).toEqual({
      tags: [
        {
          name: "Controller"
        }
      ],
      paths: {
        "/": {
          post: {
            operationId: "controllerMethod",
            parameters: [],
            produces: ["application/json"],
            responses: {
              "200": {
                description: "description",
                schema: {
                  items: {
                    type: "string"
                  },
                  type: "array"
                }
              }
            },
            tags: ["Controller"]
          }
        }
      }
    });
  });
  it("should declare an Array of Model", async () => {
    // WHEN
    class Model {
      @Property()
      id: string;
    }

    class Controller {
      @OperationPath("POST", "/")
      @Status(200, Array).Of(Model).Description("description")
      method() {}
    }

    // THEN
    const spec = getSpec(Controller, {specType: SpecTypes.SWAGGER});

    expect(spec).toEqual({
      definitions: {
        Model: {
          properties: {
            id: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      tags: [
        {
          name: "Controller"
        }
      ],
      paths: {
        "/": {
          post: {
            operationId: "controllerMethod",
            parameters: [],
            produces: ["application/json"],
            responses: {
              "200": {
                description: "description",
                schema: {
                  items: {
                    $ref: "#/definitions/Model"
                  },
                  type: "array"
                }
              }
            },
            tags: ["Controller"]
          }
        }
      }
    });
  });
  it("should declare an Generic of Model", async () => {
    // WHEN
    @Generics("T")
    class Pagination<T> {
      @CollectionOf("T")
      data: T[];

      @Property()
      totalCount: number;
    }

    @Generics("T")
    class Submission<T> {
      @Property()
      _id: string;

      @Property("T")
      data: T;
    }

    class Product {
      @Property()
      title: string;
    }

    class Controller {
      @OperationPath("POST", "/")
      @Status(200, Pagination).Of(Submission).Nested(Product).Description("description")
      async method(): Promise<Pagination<Submission<Product>> | null> {
        return null;
      }
    }

    // THEN
    const spec = getSpec(Controller, {specType: SpecTypes.SWAGGER});

    expect(spec).toEqual({
      definitions: {
        Product: {
          properties: {
            title: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      tags: [
        {
          name: "Controller"
        }
      ],
      paths: {
        "/": {
          post: {
            operationId: "controllerMethod",
            parameters: [],
            produces: ["application/json"],
            responses: {
              "200": {
                description: "description",
                schema: {
                  properties: {
                    data: {
                      items: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string"
                          },
                          data: {
                            $ref: "#/definitions/Product"
                          }
                        }
                      },
                      type: "array"
                    },
                    totalCount: {
                      type: "number"
                    }
                  },
                  type: "object"
                }
              }
            },
            tags: ["Controller"]
          }
        }
      }
    });
  });
});
