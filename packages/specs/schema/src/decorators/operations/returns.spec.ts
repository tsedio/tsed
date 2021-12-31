import "@tsed/platform-exceptions";
import {CollectionOf, Generics, getSpec, OperationPath, Property, Returns, SpecTypes} from "@tsed/schema";
import {OpenSpec3} from "../../../../openspec/src/openspec3/OpenSpec3";

describe("@Returns", () => {
  describe("Single contentType", () => {
    it("should declare a return type with object", async () => {
      // WHEN
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, String).Description("description"))
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
    it("should declare a return type", async () => {
      // WHEN
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, String).Description("description"))
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
        @(Returns().Status(200).Type(String).Description("description"))
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
    it("should declare a return type with headers (swagger)", async () => {
      // WHEN
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, String)
          .Description("description")
          .Header("x-token", "token")
          .Header("x-header", {
            value: ""
          })
          .Examples({test: "Examples"})
          .Schema({
            minLength: 3
          }))
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
    it("should declare a return type with headers (openspec)", async () => {
      // WHEN
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, String)
          .Description("description")
          .Header("x-token", "token")
          .Header("x-header", {
            value: ""
          })
          .Examples({test: "Examples"})
          .Schema({
            minLength: 3
          }))
        method() {}
      }

      // THEN
      const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});

      expect(spec).toEqual({
        paths: {
          "/": {
            post: {
              operationId: "controllerMethod",
              parameters: [],
              responses: {
                "200": {
                  content: {
                    "*/*": {
                      examples: {
                        test: "Examples"
                      },
                      schema: {
                        minLength: 3,
                        type: "string"
                      }
                    }
                  },
                  description: "description",
                  headers: {
                    "x-header": {
                      example: "",
                      schema: {
                        type: "string"
                      }
                    },
                    "x-token": {
                      example: "token",
                      schema: {
                        type: "string"
                      }
                    }
                  }
                }
              },
              tags: ["Controller"]
            }
          }
        },
        tags: [
          {
            name: "Controller"
          }
        ]
      });
    });
    it("should declare a return type with content-type", async () => {
      // WHEN
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, String).Description("description").ContentType("text/html").Examples("Examples"))
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
        @(Returns(400).Description("Bad request"))
        @Returns(401)
        @(Returns(200).Description("Success"))
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
              name: {
                type: "string",
                minLength: 1,
                description: "The error name",
                example: "UNAUTHORIZED",
                default: "UNAUTHORIZED"
              },
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
              name: {
                type: "string",
                minLength: 1,
                description: "The error name",
                example: "BAD_REQUEST",
                default: "BAD_REQUEST"
              },
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
    it("should declare error response on class", async () => {
      // WHEN
      @(Returns(400).Description("Bad request").Header("x-token", "token"))
      @Returns(401)
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200).Description("Success"))
        @(Returns(400).Description("Bad request2").Header("x-token", "token2"))
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
                "400": {
                  description: "Bad request2",
                  headers: {"x-token": {example: "token2", type: "string"}},
                  schema: {$ref: "#/definitions/BadRequest"}
                },
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
                minLength: 1,
                description: "An error message",
                type: "string"
              },
              name: {
                minLength: 1,
                description: "The error name",
                type: "string"
              }
            },
            required: ["name", "message"],
            type: "object"
          },
          BadRequest: {
            type: "object",
            properties: {
              name: {
                type: "string",
                minLength: 1,
                description: "The error name",
                example: "BAD_REQUEST",
                default: "BAD_REQUEST"
              },
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
          },
          Unauthorized: {
            type: "object",
            properties: {
              name: {
                type: "string",
                minLength: 1,
                description: "The error name",
                example: "UNAUTHORIZED",
                default: "UNAUTHORIZED"
              },
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
          @(Returns(200, String).Of(Array).Description("description"))
          method() {}
        }
      } catch (er) {
        actualError = er;
      }

      expect(actualError.message).toBe(
        "Returns.Of cannot be used with the following primitive classes: String, Number, Boolean"
      );
    });
    it("should throw an error when using of with Collection", async () => {
      // WHEN
      let actualError: any;
      try {
        class Controller {
          @OperationPath("POST", "/")
          @(Returns(200, Array).Nested(Set).Description("description"))
          method() {}
        }
      } catch (er) {
        actualError = er;
      }

      expect(actualError.message).toBe(
        "Returns.Nested cannot be used with the following classes: Map, Set, Array, String, Number, Boolean"
      );
    });
    it("should declare an Array of string", async () => {
      // WHEN
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, Array).Of(String).Description("description"))
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
        @(Returns(200, Array).Of(Model).Description("description"))
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
        @(Returns(200, Pagination)
          .Of(Submission)
          .Nested(Product)
          .Description("description")
          .Examples({
            Example1: {
              value: [
                {
                  totalCount: 0,
                  data: [
                    {
                      _id: "id",
                      data: {}
                    }
                  ]
                }
              ]
            }
          }))
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
                  examples: {
                    Example1: {
                      value: [
                        {
                          data: [
                            {
                              _id: "id",
                              data: {}
                            }
                          ],
                          totalCount: 0
                        }
                      ]
                    }
                  },
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
    it("should declare an Generic of Model (OS3)", async () => {
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
        @(Returns(200, Pagination)
          .Of(Submission)
          .Nested(Product)
          .Description("description")
          .Examples({
            Example1: {
              value: [
                {
                  totalCount: 0,
                  data: [
                    {
                      _id: "id",
                      data: {}
                    }
                  ]
                }
              ]
            }
          }))
        async method(): Promise<Pagination<Submission<Product>> | null> {
          return null;
        }
      }

      // THEN
      const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});

      expect(spec).toEqual({
        components: {
          schemas: {
            Product: {
              properties: {
                title: {
                  type: "string"
                }
              },
              type: "object"
            }
          }
        },
        paths: {
          "/": {
            post: {
              operationId: "controllerMethod",
              parameters: [],
              responses: {
                "200": {
                  content: {
                    "application/json": {
                      examples: {
                        Example1: {
                          value: [
                            {
                              data: [
                                {
                                  _id: "id",
                                  data: {}
                                }
                              ],
                              totalCount: 0
                            }
                          ]
                        }
                      },
                      schema: {
                        properties: {
                          data: {
                            items: {
                              properties: {
                                _id: {
                                  type: "string"
                                },
                                data: {
                                  $ref: "#/components/schemas/Product"
                                }
                              },
                              type: "object"
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
                  description: "description"
                }
              },
              tags: ["Controller"]
            }
          }
        },
        tags: [
          {
            name: "Controller"
          }
        ]
      });
    });
    it("should declare an Generic of Model with enum (OS3)", async () => {
      // WHEN
      @Generics("T")
      class Submission<T> {
        @Property()
        _id: string;

        @Property("T")
        data: T;
      }

      enum MyEnum {
        READ = "read",
        WRITE = "write"
      }

      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, Submission).Of(MyEnum).Description("description"))
        async method(): Promise<Submission<MyEnum> | null> {
          return null;
        }
      }

      // THEN
      const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});

      expect(spec).toEqual({
        paths: {
          "/": {
            post: {
              operationId: "controllerMethod",
              parameters: [],
              responses: {
                "200": {
                  content: {
                    "application/json": {
                      schema: {
                        properties: {
                          _id: {
                            type: "string"
                          },
                          data: {
                            enum: ["read", "write"],
                            type: "string"
                          }
                        },
                        type: "object"
                      }
                    }
                  },
                  description: "description"
                }
              },
              tags: ["Controller"]
            }
          }
        },
        tags: [
          {
            name: "Controller"
          }
        ]
      });
    });
    it("should declare an Generic of Model with enum with pagination(OS3)", async () => {
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

      enum MyEnum {
        READ = "read",
        WRITE = "write"
      }

      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, Pagination)
          .Of(Submission)
          .Nested(MyEnum)
          .Description("description")
          .Examples({
            Example1: {
              value: [
                {
                  totalCount: 0,
                  data: [
                    {
                      _id: "id",
                      data: {}
                    }
                  ]
                }
              ]
            }
          }))
        async method(): Promise<Pagination<Submission<MyEnum>> | null> {
          return null;
        }
      }

      // THEN
      const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});

      expect(spec).toEqual({
        paths: {
          "/": {
            post: {
              operationId: "controllerMethod",
              parameters: [],
              responses: {
                "200": {
                  content: {
                    "application/json": {
                      examples: {
                        Example1: {
                          value: [
                            {
                              data: [
                                {
                                  _id: "id",
                                  data: {}
                                }
                              ],
                              totalCount: 0
                            }
                          ]
                        }
                      },
                      schema: {
                        properties: {
                          data: {
                            items: {
                              properties: {
                                _id: {
                                  type: "string"
                                },
                                data: {
                                  enum: ["read", "write"],
                                  type: "string"
                                }
                              },
                              type: "object"
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
                  description: "description"
                }
              },
              tags: ["Controller"]
            }
          }
        },
        tags: [
          {
            name: "Controller"
          }
        ]
      });
    });
  });
  describe("Multiple contentType", () => {
    it("should manage multiple content and model", () => {
      // WHEN
      class Model {
        @Property()
        id: string;
      }

      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, Model).Description("description"))
        @(Returns(200, String).ContentType("text/html"))
        @(Returns(200, String).ContentType("text/xml"))
        method() {}
      }

      const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});

      expect(spec).toEqual({
        components: {
          schemas: {
            Model: {
              properties: {
                id: {
                  type: "string"
                }
              },
              type: "object"
            }
          }
        },
        paths: {
          "/": {
            post: {
              operationId: "controllerMethod",
              parameters: [],
              responses: {
                "200": {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/Model"
                      }
                    },
                    "text/html": {
                      schema: {
                        type: "string"
                      }
                    },
                    "text/xml": {
                      schema: {
                        type: "string"
                      }
                    }
                  },
                  description: "description"
                }
              },
              tags: ["Controller"]
            }
          }
        },
        tags: [
          {
            name: "Controller"
          }
        ]
      });
    });
  });
  describe("Title", () => {
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
        @(Returns(200, Pagination).Of(Submission).Nested(Product).Title("PaginatedSubmissionProduct").Description("description"))
        async method(): Promise<Pagination<Submission<Product>> | null> {
          return null;
        }
      }

      // THEN
      const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});

      expect(spec).toEqual({
        components: {
          schemas: {
            Product: {
              properties: {
                title: {
                  type: "string"
                }
              },
              type: "object"
            },
            PaginatedSubmissionProduct: {
              properties: {
                data: {
                  items: {
                    properties: {
                      _id: {
                        type: "string"
                      },
                      data: {
                        $ref: "#/components/schemas/Product"
                      }
                    },
                    type: "object"
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
        paths: {
          "/": {
            post: {
              operationId: "controllerMethod",
              parameters: [],
              responses: {
                "200": {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/PaginatedSubmissionProduct"
                      }
                    }
                  },
                  description: "description"
                }
              },
              tags: ["Controller"]
            }
          }
        },
        tags: [
          {
            name: "Controller"
          }
        ]
      });
    });
  });

  describe("Multiple return types", () => {
    class ClassA {
      @Property()
      prop1: string;

      @Property()
      prop2: string;
    }

    class ClassB {
      @Property()
      prop3: string;

      @Property()
      prop4: string;
    }

    it("should return oneOf schema", () => {
      class Controller {
        @Returns(200, [ClassA, ClassB])
        @OperationPath("GET", "/")
        method() {}
      }

      const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI}) as Partial<OpenSpec3>;

      expect(spec.paths!["/"].get!.responses["200"].content!["application/json"].schema).toEqual({
        oneOf: [
          {
            $ref: "#/components/schemas/ClassA"
          },
          {
            $ref: "#/components/schemas/ClassB"
          }
        ]
      });
    });

    it("should return oneOf array schema", () => {
      class Controller {
        @(Returns(200, Array).OneOf(ClassA, ClassB))
        @OperationPath("GET", "/")
        method() {}
      }

      const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI}) as Partial<OpenSpec3>;

      expect(spec.paths!["/"].get!.responses["200"].content!["application/json"].schema).toEqual({
        type: "array",
        items: {
          oneOf: [
            {
              $ref: "#/components/schemas/ClassA"
            },
            {
              $ref: "#/components/schemas/ClassB"
            }
          ]
        }
      });
    });

    it("should return allOf array schema", () => {
      class Controller {
        @(Returns(200, Array).AllOf(ClassA, ClassB))
        @OperationPath("GET", "/")
        method() {}
      }

      const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI}) as Partial<OpenSpec3>;

      expect(spec.paths!["/"].get!.responses["200"].content!["application/json"].schema).toEqual({
        type: "array",
        items: {
          allOf: [
            {
              $ref: "#/components/schemas/ClassA"
            },
            {
              $ref: "#/components/schemas/ClassB"
            }
          ]
        }
      });
    });

    it("should return allOf array schema", () => {
      class Controller {
        @(Returns(200, Array).AnyOf(ClassA, ClassB))
        @OperationPath("GET", "/")
        method() {}
      }

      const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI}) as Partial<OpenSpec3>;

      expect(spec.paths!["/"].get!.responses["200"].content!["application/json"].schema).toEqual({
        type: "array",
        items: {
          anyOf: [
            {
              $ref: "#/components/schemas/ClassA"
            },
            {
              $ref: "#/components/schemas/ClassB"
            }
          ]
        }
      });
    });
  });
});
