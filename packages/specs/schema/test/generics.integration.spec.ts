import {BodyParams, Controller, Post} from "@tsed/common";
import {expect} from "chai";
import {
  boolean,
  CollectionOf,
  date, Email,
  GenericOf,
  Generics,
  getJsonSchema,
  getSpec,
  In, MinLength,
  number,
  OperationPath,
  Property, Required,
  Returns,
  SpecTypes,
  string
} from "../src";
import {validateSpec} from "./helpers/validateSpec";

describe("Generics", () => {
  describe('JsonSchema',() => {
    describe('Basic', () => {
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
          email: string;

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

        expect(getJsonSchema(Content)).to.deep.eq({
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
                  $ref: "#/definitions/Role"
                }
              },
              required: ["email"],
              type: "object"
            }
          },
          type: "object"
        });
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
          email: string;

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

        expect(getJsonSchema(Content, {host: "http://example.com/schema"})).to.deep.eq({
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
    })
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

        expect(result).to.deep.eq({
          "properties": {
            "adjustment": {
              "properties": {
                "value": {
                  "type": "string"
                }
              },
              "type": "object"
            }
          },
          "type": "object"
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

        expect(result).to.deep.eq({
          "properties": {
            "adjustment": {
              "properties": {
                "value": {
                  "type": "number"
                }
              },
              "type": "object"
            }
          },
          "type": "object"
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

        expect(result).to.deep.eq({
          "properties": {
            "adjustment": {
              "properties": {
                "value": {
                  "type": "boolean"
                }
              },
              "type": "object"
            }
          },
          "type": "object"
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

        expect(result).to.deep.eq({
          "properties": {
            "adjustment": {
              "properties": {
                "value": {
                  "format": "date-time",
                  "type": "string"
                }
              },
              "type": "object"
            }
          },
          "type": "object"
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

        expect(result).to.deep.eq({
          "properties": {
            "adjustment": {
              "properties": {
                "value": {
                  "type": "string"
                }
              },
              "type": "object"
            }
          },
          "type": "object"
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

        expect(result).to.deep.eq({
          "properties": {
            "adjustment": {
              "properties": {
                "value": {
                  "type": "number"
                }
              },
              "type": "object"
            }
          },
          "type": "object"
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

        expect(result).to.deep.eq({
          "properties": {
            "adjustment": {
              "properties": {
                "value": {
                  "type": "boolean"
                }
              },
              "type": "object"
            }
          },
          "type": "object"
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

        expect(result).to.deep.eq({
          "properties": {
            "adjustment": {
              "properties": {
                "value": {
                  "format": "date-time",
                  "type": "string"
                }
              },
              "type": "object"
            }
          },
          "type": "object"
        });
      });
      it("should generate JsonSchema with 'enum' from generic object", () => {
        enum AdjustmentType {
          PRICE = "price",
          DELAY = "delay",
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

        expect(result).to.deep.eq({
          "properties": {
            "adjustment": {
              "properties": {
                "value": {
                  "enum": [
                    "price",
                    "delay"
                  ],
                  "type": "string"
                }
              },
              "type": "object"
            }
          },
          "type": "object"
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

        expect(result).to.deep.eq({
          "properties": {
            "adjustment": {
              "properties": {
                "value": {
                  "type": "object"
                }
              },
              "type": "object"
            }
          },
          "type": "object"
        });
      });
    });
  })
  describe("Generics OpenSpec", () => {
    describe('Adjustment<number>', () => {
      it("should generate openspec 3", async () => {
        @Generics("T")
        class UserProperty<T> {
          @Property("T")
          value: T;
        }

        class Adjustment {
          @GenericOf(Number)
          adjustment: UserProperty<number>;
        }

        @Controller("/hello-world")
        class HelloWorldController {
          @Post("/")
          get(@BodyParams() m: Adjustment) {
            return m;
          }
        }
        const spec = getSpec(HelloWorldController, {specType: SpecTypes.OPENAPI});

        expect(spec).to.deep.eq({
          "components": {
            "schemas": {
              "Adjustment": {
                "properties": {
                  "adjustment": {
                    "properties": {
                      "value": {
                        "type": "number"
                      }
                    },
                    "type": "object"
                  }
                },
                "type": "object"
              }
            }
          },
          "paths": {
            "/hello-world": {
              "post": {
                "operationId": "helloWorldControllerGet",
                "parameters": [],
                "requestBody": {
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/Adjustment"
                      }
                    }
                  },
                  "required": false
                },
                "responses": {
                  "200": {
                    "description": "Success"
                  }
                },
                "tags": [
                  "HelloWorldController"
                ]
              }
            }
          },
          "tags": [
            {
              "name": "HelloWorldController"
            }
          ]
        });
        expect(await validateSpec(spec, SpecTypes.OPENAPI)).to.eq(true);
      });
      it("should generate openspec 2", async () => {
        @Generics("T")
        class UserProperty<T> {
          @Property("T")
          value: T;
        }

        class Adjustment {
          @GenericOf(Number)
          adjustment: UserProperty<number>;
        }

        @Controller("/hello-world")
        class HelloWorldController {
          @Post("/")
          get(@BodyParams() m: Adjustment) {
            return m;
          }
        }
        const spec = getSpec(HelloWorldController, {specType: SpecTypes.SWAGGER});

        expect(await validateSpec(spec)).to.eq(true);
        expect(spec).to.deep.eq({
          "definitions": {
            "Adjustment": {
              "properties": {
                "adjustment": {
                  "properties": {
                    "value": {
                      "type": "number"
                    }
                  },
                  "type": "object"
                }
              },
              "type": "object"
            }
          },
          "paths": {
            "/hello-world": {
              "post": {
                "operationId": "helloWorldControllerGet",
                "parameters": [
                  {
                    "in": "body",
                    "name": "body",
                    "required": false,
                    "schema": {
                      "$ref": "#/definitions/Adjustment"
                    }
                  }
                ],
                "responses": {
                  "200": {
                    "description": "Success"
                  }
                },
                "tags": [
                  "HelloWorldController"
                ]
              }
            }
          },
          "tags": [
            {
              "name": "HelloWorldController"
            }
          ]
        });
      });
    })
    describe('Submission<T> with twice models', () => {
      it("should generate openspec 2", () => {
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

        class Article {
          @Property()
          id: string;
        }

        class Controller1 {
          @OperationPath("POST", "/")
          async method(@In("body") @GenericOf(Product) submission: Submission<Product>) {
            return null;
          }
        }

        class Controller2 {
          @OperationPath("POST", "/")
          async method(@In("body") @GenericOf(Article) submission: Submission<Article>) {
            return null;
          }
        }

        // THEN
        const spec1 = getSpec(Controller1, {specType: SpecTypes.SWAGGER});
        const spec2 = getSpec(Controller2, {specType: SpecTypes.SWAGGER});

        expect(spec1).to.deep.equal({
          definitions: {
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
                  $ref: "#/definitions/Product"
                }
              },
              type: "object"
            }
          },
          tags: [
            {
              name: "Controller1"
            }
          ],
          paths: {
            "/": {
              post: {
                operationId: "controller1Method",
                tags: ["Controller1"],
                parameters: [
                  {
                    in: "body",
                    name: "body",
                    required: false,
                    schema: {
                      $ref: "#/definitions/Submission"
                    }
                  }
                ],
                responses: {
                  "200": {
                    description: "Success"
                  }
                }
              }
            }
          }
        });
        expect(spec2).to.deep.equal({
          definitions: {
            Article: {
              properties: {
                id: {
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
                  $ref: "#/definitions/Article"
                }
              },
              type: "object"
            }
          },
          tags: [
            {
              name: "Controller2"
            }
          ],
          paths: {
            "/": {
              post: {
                operationId: "controller2Method",
                tags: ["Controller2"],
                parameters: [
                  {
                    in: "body",
                    name: "body",
                    required: false,
                    schema: {
                      $ref: "#/definitions/Submission"
                    }
                  }
                ],
                responses: {
                  "200": {
                    description: "Success"
                  }
                }
              }
            }
          }
        });
      });
      it("should generate openspec 3", () => {
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
          async method(@In("body") @GenericOf(Product) submission: Submission<Product>) {
            return null;
          }
        }

        // THEN
        const spec1 = getSpec(Controller1, {specType: SpecTypes.OPENAPI});

        expect(spec1).to.deep.equal({
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
      it("should declare a nested Generics of Model (swagger2)", () => {
        // WHEN
        @Generics("T")
        class Pagination<T> {
          @CollectionOf("T")
          data: string;

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

        class Article {
          @Property()
          id: string;
        }

        class Controller {
          @OperationPath("POST", "/")
          @(Returns(200, Pagination).Of(Submission).Nested(Product).Description("description"))
          method(): Pagination<Submission<Product>> | null {
            return null;
          }
        }

        class Controller2 {
          @OperationPath("POST", "/")
          @(Returns(200, Pagination).Of(Submission).Nested(Article).Description("description"))
          method(): Pagination<Submission<Article>> | null {
            return null;
          }
        }

        // THEN
        const spec2 = getSpec(Controller2, {specType: SpecTypes.SWAGGER});
        const spec = getSpec(Controller, {specType: SpecTypes.SWAGGER});

        expect(spec).to.deep.equal({
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
                tags: ["Controller"],
                responses: {
                  "200": {
                    description: "description",
                    schema: {
                      properties: {
                        data: {
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
                        totalCount: {
                          type: "number"
                        }
                      },
                      type: "object"
                    }
                  }
                }
              }
            }
          }
        });
        expect(spec2).to.deep.equal({
          definitions: {
            Article: {
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
              name: "Controller2"
            }
          ],
          paths: {
            "/": {
              post: {
                operationId: "controller2Method",
                parameters: [],
                produces: ["application/json"],
                tags: ["Controller2"],
                responses: {
                  "200": {
                    description: "description",
                    schema: {
                      properties: {
                        data: {
                          properties: {
                            _id: {
                              type: "string"
                            },
                            data: {
                              $ref: "#/definitions/Article"
                            }
                          },
                          type: "object"
                        },
                        totalCount: {
                          type: "number"
                        }
                      },
                      type: "object"
                    }
                  }
                }
              }
            }
          }
        });
      });
      it("should declare a nested Generics of Model (openspec3)", async () => {
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
          async method(): Promise<Pagination<Submission<Product>> | null> {
            return null;
          }
        }

        // THEN
        const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});

        expect(spec).to.deep.equal({
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
    })
    describe('Pagination<Submission<Product>>', () => {
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
        async method(): Promise<Pagination<Submission<Product>> | null> {
          return null;
        }
      }

      it("should generate openspec 3", () => {
        // THEN
        const spec1 = getSpec(MyController, {specType: SpecTypes.OPENAPI});

        expect(spec1).to.deep.equal({
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
      it('should generate openspec 2', () =>{

        const spec2 = getSpec(MyController, {specType: SpecTypes.SWAGGER});

        expect(spec2).to.deep.equal({
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
          paths: {
            "/": {
              post: {
                operationId: "myControllerMethod",
                parameters: [],
                produces: ["application/json"],
                responses: {
                  "200": {
                    description: "description",
                    schema: {
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
      })
    })
    describe('Pagination<Product>', () => {
      it("should generate openspec 2", async () => {
        // WHEN
        @Generics("T")
        class Pagination<T> {
          @CollectionOf("T")
          data: T[];

          @Property()
          totalCount: number;
        }

        class Product {
          @Property()
          title: string;
        }

        class Controller {
          @OperationPath("POST", "/")
          @(Returns(200, Pagination).Of(Product).Description("description"))
          async method(): Promise<Pagination<Product> | null> {
            return null;
          }
        }

        // THEN
        const spec = getSpec(Controller, {specType: SpecTypes.SWAGGER});

        expect(spec).to.deep.equal({
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
                tags: ["Controller"],
                responses: {
                  "200": {
                    description: "description",
                    schema: {
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
                  }
                }
              }
            }
          }
        });
      });
      it("should generate openspec 3", async () => {
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
          async method(): Promise<Pagination<Submission<Product>> | null> {
            return null;
          }
        }

        expect(getJsonSchema(Pagination)).to.deep.eq({
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

        expect(spec).to.deep.equal({
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
    })
  });
});