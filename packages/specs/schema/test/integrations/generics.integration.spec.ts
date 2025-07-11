import {
  boolean,
  CollectionOf,
  date,
  Email,
  GenericOf,
  Generics,
  getJsonSchema,
  getSpec,
  In,
  MinLength,
  number,
  OperationPath,
  Path,
  Post,
  Property,
  Required,
  Returns,
  SpecTypes,
  Status,
  string
} from "../../src/index.js";
import {validateSpec} from "../helpers/validateSpec.js";

describe("Generics: basic", () => {
  it("should generate Generic pagination with nested model (array)", () => {
    @Generics("T")
    class Paginated<T> {
      @CollectionOf("T")
      data: T[];

      @Property()
      totalCount: number;
    }

    class Product {
      @Property()
      label: string;
    }

    class Content {
      @GenericOf(Product)
      submissions: Paginated<Product>;
    }

    expect(getJsonSchema(Content)).toEqual({
      definitions: {
        Product: {
          properties: {
            label: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        submissions: {
          properties: {
            data: {
              items: {
                $ref: "#/definitions/Product"
              },
              type: "array"
            },
            totalCount: {
              type: "number"
            }
          },
          type: "object"
        }
      },
      type: "object"
    });
  });
  it("should generate Generic pagination with nested model", () => {
    @Generics("T")
    class Submission<T> {
      @Property()
      _id: string;

      @Property("T")
      data: T;
    }

    class Product {
      @Property()
      label: string;
    }

    class Content {
      @GenericOf(Product)
      submission: Submission<Product>;
    }

    expect(getJsonSchema(Content)).toEqual({
      definitions: {
        Product: {
          properties: {
            label: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        submission: {
          properties: {
            _id: {
              type: "string"
            },
            data: {
              $ref: "#/definitions/Product"
            }
          },
          type: "object"
        }
      },
      type: "object"
    });
  });
  it("should generate Generic pagination with nested model (deep generics)", () => {
    @Generics("T")
    class Paginated<T> {
      @CollectionOf("T")
      data: T[];

      @Property()
      totalCount: number;
    }

    @Generics("S")
    class Submission<S> {
      @Property()
      _id: string;

      @Property("S")
      data: S;
    }

    class Product {
      @Property()
      label: string;
    }

    class Content {
      @(GenericOf(Submission).Nested(Product))
      submissions: Paginated<Submission<Product>>;
    }

    expect(getJsonSchema(Content)).toEqual({
      definitions: {
        Product: {
          properties: {
            label: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        submissions: {
          properties: {
            data: {
              items: {
                properties: {
                  _id: {
                    type: "string"
                  },
                  data: {
                    $ref: "#/definitions/Product"
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
      },
      type: "object"
    });
  });
  it("should generate Generic with an enum", () => {
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

    class Content {
      @GenericOf(MyEnum)
      submission: Submission<MyEnum>;
    }

    expect(getJsonSchema(Content)).toEqual({
      properties: {
        submission: {
          properties: {
            _id: {
              type: "string"
            },
            data: {
              type: "string",
              enum: ["read", "write"]
            }
          },
          type: "object"
        }
      },
      type: "object"
    });
  });
  it("should generate Generic with raw json schema", () => {
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

    class Content {
      @GenericOf(string().enum(["read", "write"]))
      submission: Submission<MyEnum>;
    }

    expect(getJsonSchema(Content)).toEqual({
      properties: {
        submission: {
          properties: {
            _id: {
              type: "string"
            },
            data: {
              type: "string",
              enum: ["read", "write"]
            }
          },
          type: "object"
        }
      },
      type: "object"
    });
  });
  describe("JsonSchema", () => {
    describe("Basic", () => {
      it("should return the json schema for an inherited model and generics", () => {
        @Generics("T")
        class Base<T> {
          @Property()
          id: string;

          @Required()
          @Email()
          email: string;

          @Property("T")
          role: T;
        }

        class Model<T> extends Base<T> {
          @MinLength(0)
          declare email: string;

          @Property()
          name: string;
        }

        class Role {
          @Property()
          level: string;
        }

        class Content {
          @Property()
          id: string;

          @GenericOf(Role)
          payload: Model<Role>;
        }

        expect(getJsonSchema(Content)).toMatchInlineSnapshot(`
          {
            "definitions": {
              "Role": {
                "properties": {
                  "level": {
                    "type": "string",
                  },
                },
                "type": "object",
              },
            },
            "properties": {
              "id": {
                "type": "string",
              },
              "payload": {
                "properties": {
                  "email": {
                    "format": "email",
                    "minLength": 0,
                    "type": "string",
                  },
                  "id": {
                    "type": "string",
                  },
                  "name": {
                    "type": "string",
                  },
                  "role": {
                    "$ref": "#/definitions/Role",
                  },
                },
                "required": [
                  "email",
                ],
                "type": "object",
              },
            },
            "type": "object",
          }
        `);
      });
      it("should return the json schema with hosted schemes", () => {
        @Generics("T")
        class Base<T> {
          @Property()
          id: string;

          @Required()
          @Email()
          email: string;

          @Property("T")
          role: T;
        }

        class Model<T> extends Base<T> {
          @MinLength(0)
          declare email: string;

          @Property()
          name: string;
        }

        class Role {
          @Property()
          level: string;
        }

        class Content {
          @GenericOf(Role)
          payload: Model<Role>;
        }

        expect(getJsonSchema(Content, {host: "http://example.com/schema"})).toEqual({
          definitions: {
            Role: {
              properties: {
                level: {
                  type: "string"
                }
              },
              type: "object"
            }
          },
          properties: {
            payload: {
              properties: {
                email: {
                  format: "email",
                  minLength: 0,
                  type: "string"
                },
                id: {
                  type: "string"
                },
                name: {
                  type: "string"
                },
                role: {
                  $ref: "http://example.com/schema/Role"
                }
              },
              required: ["email"],
              type: "object"
            }
          },
          type: "object"
        });
      });
    });
    describe("using Functional api", () => {
      it("should generate JsonSchema with 'string' from generic object", () => {
        @Generics("T")
        class UserProperty<T> {
          @Property("T")
          value: T;
        }

        class Adjustment {
          @GenericOf(string())
          adjustment: UserProperty<string>;
        }

        let result = getJsonSchema(Adjustment);

        expect(result).toEqual({
          properties: {
            adjustment: {
              properties: {
                value: {
                  type: "string"
                }
              },
              type: "object"
            }
          },
          type: "object"
        });
      });
      it("should generate JsonSchema with 'number' from generic object", () => {
        @Generics("T")
        class UserProperty<T> {
          @Property("T")
          value: T;
        }

        class Adjustment {
          @GenericOf(number())
          adjustment: UserProperty<number>;
        }

        let result = getJsonSchema(Adjustment);

        expect(result).toEqual({
          properties: {
            adjustment: {
              properties: {
                value: {
                  type: "number"
                }
              },
              type: "object"
            }
          },
          type: "object"
        });
      });
      it("should generate JsonSchema with 'boolean' from generic object", () => {
        @Generics("T")
        class UserProperty<T> {
          @Property("T")
          value: T;
        }

        class Adjustment {
          @GenericOf(boolean())
          adjustment: UserProperty<Date>;
        }

        let result = getJsonSchema(Adjustment);

        expect(result).toEqual({
          properties: {
            adjustment: {
              properties: {
                value: {
                  type: "boolean"
                }
              },
              type: "object"
            }
          },
          type: "object"
        });
      });
      it("should generate JsonSchema with 'date' from generic object", () => {
        @Generics("T")
        class UserProperty<T> {
          @Property("T")
          value: T;
        }

        class Adjustment {
          @GenericOf(date().format("date-time"))
          adjustment: UserProperty<Date>;
        }

        let result = getJsonSchema(Adjustment);

        expect(result).toEqual({
          properties: {
            adjustment: {
              properties: {
                value: {
                  format: "date-time",
                  type: "string"
                }
              },
              type: "object"
            }
          },
          type: "object"
        });
      });
    });
    describe("using type", () => {
      it("should generate JsonSchema with 'string' from generic object", () => {
        @Generics("T")
        class UserProperty<T> {
          @Property("T")
          value: T;
        }

        class Adjustment {
          @GenericOf(String)
          adjustment: UserProperty<string>;
        }

        let result = getJsonSchema(Adjustment);

        expect(result).toEqual({
          properties: {
            adjustment: {
              properties: {
                value: {
                  type: "string"
                }
              },
              type: "object"
            }
          },
          type: "object"
        });
      });
      it("should generate JsonSchema with 'number' from generic object", () => {
        @Generics("T")
        class UserProperty<T> {
          @Property("T")
          value: T;
        }

        class Adjustment {
          @GenericOf(Number)
          adjustment: UserProperty<number>;
        }

        let result = getJsonSchema(Adjustment);

        expect(result).toEqual({
          properties: {
            adjustment: {
              properties: {
                value: {
                  type: "number"
                }
              },
              type: "object"
            }
          },
          type: "object"
        });
      });
      it("should generate JsonSchema with 'boolean' from generic object", () => {
        @Generics("T")
        class UserProperty<T> {
          @Property("T")
          value: T;
        }

        class Adjustment {
          @GenericOf(Boolean)
          adjustment: UserProperty<Date>;
        }

        let result = getJsonSchema(Adjustment);

        expect(result).toEqual({
          properties: {
            adjustment: {
              properties: {
                value: {
                  type: "boolean"
                }
              },
              type: "object"
            }
          },
          type: "object"
        });
      });
      it("should generate JsonSchema with 'date' from generic object", () => {
        @Generics("T")
        class UserProperty<T> {
          @Property("T")
          value: T;
        }

        class Adjustment {
          @GenericOf(Date)
          adjustment: UserProperty<Date>;
        }

        let result = getJsonSchema(Adjustment);

        expect(result).toEqual({
          properties: {
            adjustment: {
              properties: {
                value: {
                  format: "date-time",
                  type: "string"
                }
              },
              type: "object"
            }
          },
          type: "object"
        });
      });
      it("should generate JsonSchema with 'enum' from generic object", () => {
        enum AdjustmentType {
          PRICE = "price",
          DELAY = "delay"
        }

        @Generics("T")
        class UserProperty<T> {
          @Property("T")
          value: T;
        }

        class Adjustment {
          @GenericOf(AdjustmentType)
          adjustment: UserProperty<AdjustmentType>;
        }

        let result = getJsonSchema(Adjustment);

        expect(result).toEqual({
          properties: {
            adjustment: {
              properties: {
                value: {
                  enum: ["price", "delay"],
                  type: "string"
                }
              },
              type: "object"
            }
          },
          type: "object"
        });
      });
      it("should generate JsonSchema with 'object' from generic object", () => {
        @Generics("T")
        class UserProperty<T> {
          @Property("T")
          value: T;
        }

        class Adjustment {
          @GenericOf(Object)
          adjustment: UserProperty<unknown>;
        }

        let result = getJsonSchema(Adjustment);

        expect(result).toEqual({
          properties: {
            adjustment: {
              properties: {
                value: {
                  type: "object"
                }
              },
              type: "object"
            }
          },
          type: "object"
        });
      });
    });
  });
  describe("OpenSpec", () => {
    describe("Adjustment<number>", () => {
      it("should generate", async () => {
        @Generics("T")
        class UserProperty<T> {
          @Property("T")
          value: T;
        }

        class Adjustment {
          @GenericOf(Number)
          adjustment: UserProperty<number>;
        }

        @Path("/hello-world")
        class HelloWorldController {
          @Post("/")
          get(@In("body") m: Adjustment) {
            return m;
          }
        }

        const spec = getSpec(HelloWorldController, {specType: SpecTypes.OPENAPI});

        expect(spec).toEqual({
          components: {
            schemas: {
              Adjustment: {
                properties: {
                  adjustment: {
                    properties: {
                      value: {
                        type: "number"
                      }
                    },
                    type: "object"
                  }
                },
                type: "object"
              }
            }
          },
          paths: {
            "/hello-world": {
              post: {
                operationId: "helloWorldControllerGet",
                parameters: [],
                requestBody: {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/Adjustment"
                      }
                    }
                  },
                  required: false
                },
                responses: {
                  "200": {
                    description: "Success"
                  }
                },
                tags: ["HelloWorldController"]
              }
            }
          },
          tags: [
            {
              name: "HelloWorldController"
            }
          ]
        });
        expect(await validateSpec(spec, SpecTypes.OPENAPI)).toBe(true);
      });
    });
    describe("Submission<T> with twice models", () => {
      it("should generate", () => {
        // WHEN
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

        class Controller1 {
          @OperationPath("POST", "/")
          method(@In("body") @GenericOf(Product) submission: Submission<Product>) {
            return null;
          }
        }

        // THEN
        const spec1 = getSpec(Controller1, {specType: SpecTypes.OPENAPI});

        expect(spec1).toEqual({
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
              Submission: {
                properties: {
                  _id: {
                    type: "string"
                  },
                  data: {
                    $ref: "#/components/schemas/Product"
                  }
                },
                type: "object"
              }
            }
          },
          paths: {
            "/": {
              post: {
                operationId: "controller1Method",
                parameters: [],
                requestBody: {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/Submission"
                      }
                    }
                  },
                  required: false
                },
                responses: {
                  "200": {
                    description: "Success"
                  }
                },
                tags: ["Controller1"]
              }
            }
          },
          tags: [
            {
              name: "Controller1"
            }
          ]
        });
      });
      it("should declare a nested Generics of Model (openspec3)", () => {
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
          @(Returns(200, Pagination).Of(Submission).Nested(Product).Description("description"))
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
                tags: ["Controller"],
                responses: {
                  "200": {
                    content: {
                      "application/json": {
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
                                    $ref: "#/components/schemas/Product"
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
                    description: "description"
                  }
                }
              }
            }
          }
        });
      });
    });
    describe("Pagination<Submission<Product>>", () => {
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

      class MyController {
        @OperationPath("POST", "/")
        @(Returns(200, Pagination).Of(Submission).Nested(Product).Description("description"))
        method(): Promise<Pagination<Submission<Product>> | null> {
          return null as never;
        }
      }

      it("should generate", () => {
        // THEN
        const spec1 = getSpec(MyController, {specType: SpecTypes.OPENAPI});

        expect(spec1).toEqual({
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
                operationId: "myControllerMethod",
                parameters: [],
                responses: {
                  "200": {
                    content: {
                      "application/json": {
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
    describe("Pagination<Product>", () => {
      it("should generate", () => {
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
          @(Returns(200, Pagination).Of(Submission).Nested(Product).Description("description"))
          method(): Promise<Pagination<Submission<Product>> | null> {
            return null as never;
          }
        }

        expect(getJsonSchema(Pagination)).toEqual({
          properties: {
            data: {
              items: {
                $ref: "T"
              },
              type: "array"
            },
            totalCount: {
              type: "number"
            }
          },
          type: "object"
        });

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
                tags: ["Controller"],
                responses: {
                  "200": {
                    content: {
                      "application/json": {
                        schema: {
                          properties: {
                            data: {
                              items: {
                                properties: {
                                  data: {
                                    $ref: "#/components/schemas/Product"
                                  },
                                  _id: {
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
                }
              }
            }
          }
        });
      });
    });
  });
  describe("@Status", () => {
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
        @(Status(200, Pagination).Of(Submission).Nested(Product).Description("description"))
        method(): Promise<Pagination<Submission<Product>> | null> {
          return null as never;
        }
      }

      // THEN
      const spec = getSpec(Controller);

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
  });
  describe("@Returns", () => {
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
  });
  describe("@Title", () => {
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
});
