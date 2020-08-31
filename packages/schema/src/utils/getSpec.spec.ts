import * as SwaggerParser from "@apidevtools/swagger-parser";
import {expect} from "chai";
import {unlinkSync, writeJsonSync} from "fs-extra";
import {Consumes, In, Min, Name, OperationPath, Required} from "../decorators";
import {CollectionOf, Description, GenericOf, Generics, getJsonSchema, Property, Returns, SpecTypes} from "../index";
import {getSpec} from "./getSpec";

const validate = async (spec: any, version = SpecTypes.SWAGGER) => {
  const file = __dirname + "/spec.json";
  spec = {
    ...spec
  };
  try {
    if (version === SpecTypes.OPENAPI) {
      spec.openapi = "3.0.1";
    } else {
      spec.swagger = "2.0";
    }

    spec.info = {
      title: "Title",
      description: "Description",
      termsOfService: "termsOfService",
      contact: {
        email: "apiteam@swagger.io"
      },
      license: {
        name: "Apache 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0.html"
      },
      version: "1.0.0"
    };

    writeJsonSync(file, spec, {encoding: "utf8"});
    await SwaggerParser.validate(file);
    unlinkSync(file);

    return true;
  } catch (er) {
    console.error(er);
    // unlinkSync(file);

    return er;
  }
};

describe("getSpec()", () => {
  describe("In", () => {
    describe("Path", () => {
      it("should declare all schema correctly (path - swagger2)", async () => {
        // WHEN
        class Controller {
          @OperationPath("GET", "/")
          method(@In("path") @Name("basic") basic: string) {}
        }

        // THEN
        const spec = getSpec(Controller, {
          spec: SpecTypes.SWAGGER
        });
        expect(await validate(spec)).to.eq(true);
      });
      it("should declare all schema correctly (path optional - swagger2)", async () => {
        // WHEN
        class Controller {
          @OperationPath("GET", "/:id?")
          method(@In("path") @Name("id") id: string) {}
        }

        // THEN
        const spec = getSpec(Controller, {spec: SpecTypes.SWAGGER});

        expect(await validate(spec)).to.eq(true);
        expect(spec).to.deep.equal({
          definitions: {},
          tags: [
            {
              name: "Controller"
            }
          ],
          paths: {
            "/": {
              get: {
                operationId: "controllerMethod",
                parameters: [],
                responses: {
                  "200": {
                    description: "Success"
                  }
                },
                tags: ["Controller"]
              }
            },
            "/{id}": {
              get: {
                operationId: "controllerMethodById",
                parameters: [
                  {
                    in: "path",
                    name: "id",
                    required: true,
                    type: "string"
                  }
                ],
                responses: {
                  "200": {
                    description: "Success"
                  }
                },
                tags: ["Controller"]
              }
            }
          }
        });
      });
      it("should declare all schema correctly with expression", async () => {
        // WHEN
        class Controller {
          @OperationPath("GET", "/:id?")
          method(@In("path") id: string) {}
        }

        // THEN
        const spec = getSpec(Controller, {spec: SpecTypes.SWAGGER});

        expect(await validate(spec)).to.eq(true);
        expect(spec).to.deep.equal({
          definitions: {},
          tags: [
            {
              name: "Controller"
            }
          ],
          paths: {
            "/": {
              get: {
                operationId: "controllerMethod",
                parameters: [],
                tags: ["Controller"],
                responses: {
                  "200": {
                    description: "Success"
                  }
                }
              }
            },
            "/{id}": {
              get: {
                operationId: "controllerMethodById",
                tags: ["Controller"],
                parameters: [
                  {
                    in: "path",
                    name: "id",
                    required: true,
                    type: "string"
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
    });
    describe("Query", () => {
      it("should declare all schema correctly (query - swagger2)", async () => {
        // WHEN
        class Controller {
          @OperationPath("GET", "/:id")
          method(@In("query") @Name("basic") basic: string) {}
        }

        // THEN
        const spec = getSpec(Controller, {spec: SpecTypes.SWAGGER});

        expect(spec).to.deep.equal({
          definitions: {},
          tags: [
            {
              name: "Controller"
            }
          ],
          paths: {
            "/{id}": {
              get: {
                operationId: "controllerMethod",
                tags: ["Controller"],
                parameters: [
                  {
                    in: "path",
                    name: "id",
                    required: true,
                    type: "string"
                  },
                  {
                    in: "query",
                    name: "basic",
                    required: false,
                    type: "string"
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
      it("should declare all schema correctly (query - swagger2 - model)", async () => {
        // WHEN
        class QueryModel {
          @Property()
          id: string;

          @Property()
          name: string;
        }

        class Controller {
          @OperationPath("GET", "/:id")
          method(@In("query") basic: QueryModel) {}
        }

        // THEN
        const spec = getSpec(Controller, {spec: SpecTypes.SWAGGER});

        expect(spec).to.deep.equal({
          definitions: {},
          tags: [
            {
              name: "Controller"
            }
          ],
          paths: {
            "/{id}": {
              get: {
                operationId: "controllerMethod",
                tags: ["Controller"],
                parameters: [
                  {
                    in: "path",
                    name: "id",
                    required: true,
                    type: "string"
                  },
                  {
                    in: "query",
                    name: "id",
                    required: false,
                    type: "string"
                  },
                  {
                    in: "query",
                    name: "name",
                    required: false,
                    type: "string"
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
      it("should declare all schema correctly (query - openapi3 - model)", async () => {
        // WHEN
        class QueryModel {
          @Property()
          id: string;

          @Property()
          name: string;
        }

        class Controller {
          @OperationPath("GET", "/:id")
          method(@In("query") basic: QueryModel) {}
        }

        // THEN
        const spec = getSpec(Controller, {spec: SpecTypes.OPENAPI});

        expect(spec).to.deep.equal({
          components: {
            schemas: {
              QueryModel: {
                properties: {
                  id: {
                    type: "string"
                  },
                  name: {
                    type: "string"
                  }
                },
                type: "object"
              }
            }
          },
          paths: {
            "/{id}": {
              get: {
                operationId: "controllerMethod",
                parameters: [
                  {
                    in: "path",
                    name: "id",
                    required: true,
                    type: "string"
                  },
                  {
                    in: "query",
                    required: false,
                    schema: {
                      $ref: "#/components/schemas/QueryModel"
                    }
                  }
                ],
                responses: {
                  "200": {
                    description: "Success"
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
      it("should declare all schema correctly (query - swagger2 - array string)", async () => {
        // WHEN
        class Controller {
          @OperationPath("GET", "/:id")
          method(@In("query") @Name("basic") basic: string[]) {}
        }

        // THEN
        const spec = getSpec(Controller, {spec: SpecTypes.SWAGGER});

        expect(spec).to.deep.equal({
          definitions: {},
          tags: [
            {
              name: "Controller"
            }
          ],
          paths: {
            "/{id}": {
              get: {
                operationId: "controllerMethod",
                tags: ["Controller"],
                parameters: [
                  {
                    in: "path",
                    name: "id",
                    required: true,
                    type: "string"
                  },
                  {
                    collectionFormat: "multi",
                    in: "query",
                    items: {
                      type: "string"
                    },
                    name: "basic",
                    required: false,
                    type: "array"
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
      it("should declare all schema correctly (query - openapi3 - array string)", async () => {
        // WHEN
        class Controller {
          @OperationPath("GET", "/:id")
          method(@In("query") @Name("basic") basic: string[]) {}
        }

        // THEN
        const spec = getSpec(Controller, {spec: SpecTypes.OPENAPI});

        expect(spec).to.deep.equal({
          components: {
            schemas: {}
          },
          paths: {
            "/{id}": {
              get: {
                operationId: "controllerMethod",
                parameters: [
                  {
                    in: "path",
                    name: "id",
                    required: true,
                    type: "string"
                  },
                  {
                    in: "query",
                    name: "basic",
                    required: false,
                    schema: {
                      items: {
                        type: "object"
                      },
                      type: "array"
                    }
                  }
                ],
                responses: {
                  "200": {
                    description: "Success"
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
      it("should declare all schema correctly (query - swagger2 - Map)", async () => {
        // WHEN
        class Controller {
          @OperationPath("GET", "/:id")
          method(@In("query") @Name("basic") @CollectionOf(String) basic: Map<string, string>) {}
        }

        // THEN
        const spec = getSpec(Controller, {spec: SpecTypes.SWAGGER});

        expect(spec).to.deep.equal({
          definitions: {},
          tags: [
            {
              name: "Controller"
            }
          ],
          paths: {
            "/{id}": {
              get: {
                operationId: "controllerMethod",
                tags: ["Controller"],
                parameters: [
                  {
                    in: "path",
                    name: "id",
                    required: true,
                    type: "string"
                  },
                  {
                    in: "query",
                    name: "basic",
                    required: false,
                    type: "object",
                    additionalProperties: {
                      type: "string"
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
      it("should declare all schema correctly (query - openapi3 - Map)", async () => {
        // WHEN
        class Controller {
          @OperationPath("GET", "/:id")
          method(@In("query") @Name("basic") @CollectionOf(String) basic: Map<string, string>) {}
        }

        // THEN
        const spec = getSpec(Controller, {spec: SpecTypes.OPENAPI});

        expect(spec).to.deep.equal({
          components: {
            schemas: {}
          },
          paths: {
            "/{id}": {
              get: {
                operationId: "controllerMethod",
                parameters: [
                  {
                    in: "path",
                    name: "id",
                    required: true,
                    type: "string"
                  },
                  {
                    in: "query",
                    name: "basic",
                    required: false,
                    schema: {
                      additionalProperties: {
                        type: "string"
                      },
                      type: "object"
                    }
                  }
                ],
                responses: {
                  "200": {
                    description: "Success"
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
    describe("Body", () => {
      it("should declare all schema correctly (model - swagger2)", async () => {
        class MyModel {
          @Property()
          prop: string;
        }

        class Controller {
          @Consumes("application/json")
          @OperationPath("POST", "/")
          method(@In("body") @Required() num: MyModel) {}
        }

        // THEN
        const spec = getSpec(Controller, {spec: SpecTypes.SWAGGER});

        expect(spec).to.deep.equal({
          definitions: {
            MyModel: {
              type: "object",
              properties: {
                prop: {
                  type: "string"
                }
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
                consumes: ["application/json"],
                parameters: [
                  {
                    in: "body",
                    name: "body",
                    required: true,
                    schema: {
                      $ref: "#/definitions/MyModel"
                    }
                  }
                ],
                responses: {
                  "200": {
                    description: "Success"
                  }
                },
                tags: ["Controller"]
              }
            }
          }
        });
      });
      it("should declare all schema correctly (model - openapi3)", async () => {
        class MyModel {
          @Property()
          prop: string;
        }

        class Controller {
          @Consumes("application/json")
          @OperationPath("POST", "/")
          method(@In("body") @Required() num: MyModel) {}
        }

        // THEN
        const spec = getSpec(Controller, {spec: SpecTypes.OPENAPI});

        expect(spec).to.deep.equal({
          components: {
            schemas: {
              MyModel: {
                properties: {
                  prop: {
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
                requestBody: {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/MyModel"
                      }
                    }
                  },
                  required: true
                },
                tags: ["Controller"],
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
      it("should declare all schema correctly (Array - model - swagger2)", async () => {
        // WHEN
        class Product {
          @Property()
          title: string;
        }

        class Controller {
          @OperationPath("POST", "/")
          async method(@In("body") @CollectionOf(Product) products: Product[]) {
            return null;
          }
        }

        // THEN
        const spec = getSpec(Controller, {spec: SpecTypes.SWAGGER});

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
                parameters: [
                  {
                    in: "body",
                    name: "body",
                    required: false,
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/definitions/Product"
                      }
                    }
                  }
                ],
                responses: {
                  "200": {
                    description: "Success"
                  }
                },
                tags: ["Controller"]
              }
            }
          }
        });
      });
      it("should declare all schema correctly (Map - model - swagger2)", async () => {
        // WHEN
        class Product {
          @Property()
          title: string;
        }

        class Controller {
          @OperationPath("POST", "/")
          async method(@In("body") @CollectionOf(Product) products: Map<string, Product>) {
            return null;
          }
        }

        // THEN
        const spec = getSpec(Controller, {spec: SpecTypes.SWAGGER});

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
                parameters: [
                  {
                    in: "body",
                    name: "body",
                    required: false,
                    schema: {
                      additionalProperties: {
                        $ref: "#/definitions/Product"
                      },
                      type: "object"
                    }
                  }
                ],
                tags: ["Controller"],
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
      it("should declare all schema correctly (inline - swagger2)", async () => {
        class Controller {
          @Consumes("application/json")
          @OperationPath("POST", "/")
          method(@In("body") @Required() @Name("num") @Min(0) num: number, @In("body") @Required() @Name("test") @Min(0) num2: number) {}
        }

        // THEN
        const spec = getSpec(Controller, {spec: SpecTypes.SWAGGER});

        expect(spec).to.deep.equal({
          definitions: {},
          tags: [
            {
              name: "Controller"
            }
          ],
          paths: {
            "/": {
              post: {
                consumes: ["application/json"],
                operationId: "controllerMethod",
                tags: ["Controller"],
                parameters: [
                  {
                    in: "body",
                    name: "body",
                    required: true,
                    schema: {
                      properties: {
                        num: {
                          minimum: 0,
                          type: "number"
                        },
                        test: {
                          minimum: 0,
                          type: "number"
                        }
                      },
                      required: ["num", "test"],
                      type: "object"
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
      it("should declare all schema correctly (Array - inline - swagger2)", async () => {
        class Controller {
          @Consumes("application/json")
          @OperationPath("POST", "/")
          method(
            @In("body") @Required() @Name("num") @CollectionOf(Number) @Min(0) num: number[],
            @In("body") @Required() @Name("test") @Min(0) num2: number
          ) {}
        }

        // THEN
        const spec = getSpec(Controller, {spec: SpecTypes.SWAGGER});
        expect(await validate(spec)).to.eq(true);
        expect(spec).to.deep.equal({
          definitions: {},
          tags: [
            {
              name: "Controller"
            }
          ],
          paths: {
            "/": {
              post: {
                consumes: ["application/json"],
                operationId: "controllerMethod",
                tags: ["Controller"],
                parameters: [
                  {
                    in: "body",
                    name: "body",
                    required: true,
                    schema: {
                      properties: {
                        num: {
                          type: "array",
                          items: {
                            minimum: 0,
                            type: "number"
                          }
                        },
                        test: {
                          minimum: 0,
                          type: "number"
                        }
                      },
                      required: ["num", "test"],
                      type: "object"
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
      it("should declare all schema correctly (inline - openapi3)", async () => {
        class Controller {
          @Consumes("application/json")
          @OperationPath("POST", "/")
          method(
            @In("body") @Required() @Name("num") @CollectionOf(Number) @Min(0) num: number[],
            @In("body") @Required() @Name("test") @Min(0) num2: number
          ) {}
        }

        // THEN
        const spec = getSpec(Controller, {spec: SpecTypes.OPENAPI});
        expect(await validate(spec, SpecTypes.OPENAPI)).to.eq(true);
        expect(spec).to.deep.equal({
          components: {
            schemas: {}
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
                requestBody: {
                  content: {
                    "application/json": {
                      schema: {
                        properties: {
                          num: {
                            items: {
                              minimum: 0,
                              type: "number"
                            },
                            type: "array"
                          },
                          test: {
                            minimum: 0,
                            type: "number"
                          }
                        },
                        required: ["num", "test"],
                        type: "object"
                      }
                    }
                  },
                  required: true
                },
                responses: {
                  "200": {
                    description: "Success"
                  }
                },
                tags: ["Controller"]
              }
            }
          }
        });
      });
      it("should declare all schema correctly (generics - openapi3)", () => {
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
        const spec1 = getSpec(Controller1, {spec: SpecTypes.SWAGGER});
        const spec2 = getSpec(Controller2, {spec: SpecTypes.SWAGGER});

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
    });
  });

  describe("Response", () => {
    it("should declare all schema correctly (swagger2)", async () => {
      // WHEN
      @Name("AliasController")
      @Description("Class description")
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, String).Description("description"))
        method() {}
      }

      // THEN
      const spec = getSpec(Controller, {spec: SpecTypes.SWAGGER});

      expect(spec).to.deep.equal({
        definitions: {},
        tags: [
          {
            name: "AliasController",
            description: "Class description"
          }
        ],
        paths: {
          "/": {
            post: {
              operationId: "aliasControllerMethod",
              parameters: [],
              tags: ["AliasController"],
              responses: {
                "200": {
                  description: "description",
                  schema: {
                    type: "string"
                  }
                }
              }
            }
          }
        }
      });
    });
    it("should declare all schema correctly (openapi3)", async () => {
      // WHEN
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, String).Description("description"))
        method() {}
      }

      // THEN
      const spec = getSpec(Controller, {spec: SpecTypes.OPENAPI});

      expect(spec).to.deep.equal({
        components: {
          schemas: {}
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
                    "*/*": {
                      schema: {
                        type: "string"
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
    it("should declare an Array of string (swagger2)", async () => {
      // WHEN
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, Array).Of(String).Description("description"))
        method() {}
      }

      // THEN
      const spec = getSpec(Controller, {spec: SpecTypes.SWAGGER});

      expect(spec).to.deep.equal({
        definitions: {},
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
                    items: {
                      type: "string"
                    },
                    type: "array"
                  }
                }
              }
            }
          }
        }
      });
    });
    it("should declare an Array of string (openapi3)", async () => {
      // WHEN
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, Array).Of(String).Description("description"))
        method() {}
      }

      // THEN
      const spec = getSpec(Controller, {spec: SpecTypes.OPENAPI});

      expect(spec).to.deep.equal({
        components: {
          schemas: {}
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
                        items: {
                          type: "string"
                        },
                        type: "array"
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
    it("should declare an Generic of Model (swagger2)", async () => {
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
      const spec = getSpec(Controller, {spec: SpecTypes.SWAGGER});

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
    it("should declare an Generic of Model (openspec3)", async () => {
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
      const spec = getSpec(Controller, {spec: SpecTypes.OPENAPI});

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
      const spec2 = getSpec(Controller2, {spec: SpecTypes.SWAGGER});
      const spec = getSpec(Controller, {spec: SpecTypes.SWAGGER});

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
      const spec = getSpec(Controller, {spec: SpecTypes.OPENAPI});

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
  });
});
