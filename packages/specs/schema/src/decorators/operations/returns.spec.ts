import "@tsed/platform-exceptions";

import {OpenSpec3} from "@tsed/openspec";

import {SpecTypes} from "../../domain/SpecTypes.js";
import {getSpec} from "../../utils/getSpec.js";
import {CollectionOf} from "../collections/collectionOf.js";
import {Property} from "../common/property.js";
import {Generics} from "../generics/generics.js";
import {OperationPath} from "./operationPath.js";
import {Returns} from "./returns.js";

describe("@Returns", () => {
  describe("Single contentType", () => {
    it("should declare a return type with object", () => {
      // WHEN
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, String).Description("description"))
        method() {}
      }

      // THEN
      const spec = getSpec(Controller);

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
    it("should declare a return type", () => {
      // WHEN
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, String).Description("description"))
        method() {}
      }

      // THEN
      const spec = getSpec(Controller);

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
    it("should declare a return type (Status().Type())", () => {
      // WHEN
      class Controller {
        @OperationPath("POST", "/")
        @(Returns().Status(200).Type(String).Description("description"))
        method() {}
      }

      // THEN
      const spec = getSpec(Controller);

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
    it("should declare a return type with headers (openspec)", () => {
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
    it("should declare a return type with headers (openspec - header)", () => {
      // WHEN
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, String).Description("description").Header("x-token").Examples({test: "Examples"}).Schema({
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
                    "x-token": {
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
    it("should declare a return type with content-type", () => {
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
    it("should declare error response", () => {
      // WHEN
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(400).Description("Bad request"))
        @Returns(401)
        @(Returns(200).Description("Success"))
        method() {}
      }

      // THEN
      const spec = getSpec(Controller);

      expect(spec).toEqual({
        components: {
          schemas: {
            BadRequest: {
              properties: {
                errors: {
                  description: "A list of related errors",
                  items: {
                    $ref: "#/components/schemas/GenericError"
                  },
                  type: "array"
                },
                message: {
                  description: "An error message",
                  minLength: 1,
                  type: "string"
                },
                name: {
                  default: "BAD_REQUEST",
                  description: "The error name",
                  example: "BAD_REQUEST",
                  minLength: 1,
                  type: "string"
                },
                stack: {
                  description: "The stack trace (only in development mode)",
                  type: "string"
                },
                status: {
                  default: 400,
                  description: "The status code of the exception",
                  example: 400,
                  type: "number"
                }
              },
              required: ["name", "message", "status"],
              type: "object"
            },
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
              properties: {
                errors: {
                  description: "A list of related errors",
                  items: {
                    $ref: "#/components/schemas/GenericError"
                  },
                  type: "array"
                },
                message: {
                  description: "An error message",
                  minLength: 1,
                  type: "string"
                },
                name: {
                  default: "UNAUTHORIZED",
                  description: "The error name",
                  example: "UNAUTHORIZED",
                  minLength: 1,
                  type: "string"
                },
                stack: {
                  description: "The stack trace (only in development mode)",
                  type: "string"
                },
                status: {
                  default: 401,
                  description: "The status code of the exception",
                  example: 401,
                  type: "number"
                }
              },
              required: ["name", "message", "status"],
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
                    "*/*": {
                      schema: {
                        type: "object"
                      }
                    }
                  },
                  description: "Success"
                },
                "400": {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/BadRequest"
                      }
                    }
                  },
                  description: "Bad request"
                },
                "401": {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/Unauthorized"
                      }
                    }
                  },
                  description: "Unauthorized"
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
    it("should declare error response on class", () => {
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
      const spec = getSpec(Controller);

      expect(spec).toEqual({
        components: {
          schemas: {
            BadRequest: {
              properties: {
                errors: {
                  description: "A list of related errors",
                  items: {
                    $ref: "#/components/schemas/GenericError"
                  },
                  type: "array"
                },
                message: {
                  description: "An error message",
                  minLength: 1,
                  type: "string"
                },
                name: {
                  default: "BAD_REQUEST",
                  description: "The error name",
                  example: "BAD_REQUEST",
                  minLength: 1,
                  type: "string"
                },
                stack: {
                  description: "The stack trace (only in development mode)",
                  type: "string"
                },
                status: {
                  default: 400,
                  description: "The status code of the exception",
                  example: 400,
                  type: "number"
                }
              },
              required: ["name", "message", "status"],
              type: "object"
            },
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
              properties: {
                errors: {
                  description: "A list of related errors",
                  items: {
                    $ref: "#/components/schemas/GenericError"
                  },
                  type: "array"
                },
                message: {
                  description: "An error message",
                  minLength: 1,
                  type: "string"
                },
                name: {
                  default: "UNAUTHORIZED",
                  description: "The error name",
                  example: "UNAUTHORIZED",
                  minLength: 1,
                  type: "string"
                },
                stack: {
                  description: "The stack trace (only in development mode)",
                  type: "string"
                },
                status: {
                  default: 401,
                  description: "The status code of the exception",
                  example: 401,
                  type: "number"
                }
              },
              required: ["name", "message", "status"],
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
                    "*/*": {
                      schema: {
                        type: "object"
                      }
                    }
                  },
                  description: "Success"
                },
                "400": {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/BadRequest"
                      }
                    }
                  },
                  description: "Bad request2",
                  headers: {
                    "x-token": {
                      example: "token2",
                      schema: {
                        type: "string"
                      }
                    }
                  }
                },
                "401": {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/Unauthorized"
                      }
                    }
                  },
                  description: "Unauthorized"
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
    it("should throw an error when using of with String", () => {
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

      expect(actualError.message).toBe("Returns.Of cannot be used with the following primitive classes: String, Number, Boolean");
    });
    it("should throw an error when using of with Collection", () => {
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
    it("should declare an Array of string", () => {
      // WHEN
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, Array).Of(String).Description("description"))
        method() {}
      }

      // THEN
      const spec = getSpec(Controller);

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
                        items: {
                          type: "string"
                        },
                        type: "array"
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
    it("should declare an Array of Model", () => {
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
      const spec = getSpec(Controller);

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
                        items: {
                          $ref: "#/components/schemas/Model"
                        },
                        type: "array"
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
    it("should declare an Generic of Model", () => {
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
        method(): Promise<Pagination<Submission<Product>> | null> {
          return null as never;
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
    it("should declare an Generic of Model with enum (OS3)", () => {
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
        method(): Promise<Submission<MyEnum> | null> {
          return Promise.resolve(null);
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
    it("should declare an Generic of Model with enum with pagination(OS3)", () => {
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
        method(): Promise<Pagination<Submission<MyEnum>> | null> {
          return null as never;
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
    it("should apply application/json content type if OneOf/AnyOf/AllOf is used without base model", () => {
      class Model {
        @Property()
        id: string;
      }

      class Model2 {
        @Property()
        id: string;
      }

      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200).OneOf(Model, Model2).Description("description"))
        method() {
          return {};
        }
      }

      const result = getSpec(Controller, {specType: SpecTypes.OPENAPI});

      expect(result).toEqual({
        components: {
          schemas: {
            Model: {
              properties: {
                id: {
                  type: "string"
                }
              },
              type: "object"
            },
            Model2: {
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
                        oneOf: [
                          {
                            $ref: "#/components/schemas/Model"
                          },
                          {
                            $ref: "#/components/schemas/Model2"
                          }
                        ]
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
    it("should declare an Generic of Model", () => {
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
        method(): Promise<Pagination<Submission<Product>> | null> {
          return null as never;
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
  });
});
