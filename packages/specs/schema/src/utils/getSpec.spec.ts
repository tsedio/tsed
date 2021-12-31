import {validateSpec} from "../../test/helpers/validateSpec";
import {Consumes, In, Min, Name, OperationPath, Required} from "../decorators";
import {CollectionOf, Description, JsonParameterTypes, Property, Returns, SpecTypes} from "../index";
import {getSpec} from "./getSpec";

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
          specType: SpecTypes.SWAGGER
        });
        expect(await validateSpec(spec)).toBe(true);
      });
      it("should declare all schema correctly (path optional - swagger2)", async () => {
        // WHEN
        class Controller {
          @OperationPath("GET", "/:id?")
          method(@In("path") @Name("id") id: string) {}
        }

        // THEN
        const spec = getSpec(Controller, {specType: SpecTypes.SWAGGER});

        expect(await validateSpec(spec)).toBe(true);
        expect(spec).toEqual({
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
        const spec = getSpec(Controller, {specType: SpecTypes.SWAGGER});

        expect(await validateSpec(spec)).toBe(true);
        expect(spec).toEqual({
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
      it("should declare all schema correctly (path - openspec3)", async () => {
        // WHEN
        class Controller {
          @OperationPath("GET", "/:basic")
          method(@In("path") @Name("basic") basic: string) {}
        }

        // THEN
        const spec = getSpec(Controller, {
          specType: SpecTypes.OPENAPI
        });
        expect(spec).toEqual({
          paths: {
            "/{basic}": {
              get: {
                operationId: "controllerMethod",
                parameters: [
                  {
                    in: "path",
                    name: "basic",
                    required: true,
                    schema: {type: "string"}
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
        expect(await validateSpec(spec, SpecTypes.OPENAPI)).toBe(true);
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
        const spec = getSpec(Controller, {specType: SpecTypes.SWAGGER});

        expect(spec).toEqual({
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
        const spec = getSpec(Controller, {specType: SpecTypes.SWAGGER});

        expect(spec).toEqual({
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
      it("should declare all schema correctly (query -  openspec3 - model)", async () => {
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
        const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});
        expect(spec).toEqual({
          paths: {
            "/{id}": {
              get: {
                operationId: "controllerMethod",
                parameters: [
                  {in: "path", name: "id", required: true, schema: {type: "string"}},
                  {in: "query", required: false, name: "id", schema: {type: "string"}},
                  {in: "query", required: false, name: "name", schema: {type: "string"}}
                ],
                responses: {"200": {description: "Success"}},
                tags: ["Controller"]
              }
            }
          },
          tags: [{name: "Controller"}]
        });
      });
      it("should declare all schema correctly (query - swagger2 - array string)", async () => {
        // WHEN
        class Controller {
          @OperationPath("GET", "/:id")
          method(@In("query") @Name("basic") basic: string[]) {}
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
      it("should declare all schema correctly (query -  openspec3 - array string)", async () => {
        // WHEN
        class Controller {
          @OperationPath("GET", "/:id")
          method(@In("query") @Name("basic") basic: string[]) {}
        }

        // THEN
        const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});

        expect(spec).toEqual({
          paths: {
            "/{id}": {
              get: {
                operationId: "controllerMethod",
                parameters: [
                  {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: {type: "string"}
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
        const spec = getSpec(Controller, {specType: SpecTypes.SWAGGER});

        expect(spec).toEqual({
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
      it("should declare all schema correctly (query -  openspec3 - Map)", async () => {
        // WHEN
        class Controller {
          @OperationPath("GET", "/:id")
          method(@In("query") @Name("basic") @CollectionOf(String) basic: Map<string, string>) {}
        }

        // THEN
        const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});

        expect(spec).toEqual({
          paths: {
            "/{id}": {
              get: {
                operationId: "controllerMethod",
                parameters: [
                  {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: {type: "string"}
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
        const spec = getSpec(Controller, {specType: SpecTypes.SWAGGER});

        expect(spec).toEqual({
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
      it("should declare all schema correctly (model -  openspec3)", async () => {
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
        const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});

        expect(spec).toEqual({
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
      it("should declare all schema correctly (Array - inline - OS3)", async () => {
        class Product {
          @Property()
          title: string;
        }

        class Controller {
          @Consumes("application/json")
          @OperationPath("POST", "/")
          method(@In("body") @Required() @CollectionOf(Product) products: Product[]) {}
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
                requestBody: {
                  content: {
                    "application/json": {
                      schema: {
                        items: {
                          $ref: "#/components/schemas/Product"
                        },
                        type: "array"
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
          },
          tags: [
            {
              name: "Controller"
            }
          ]
        });
      });
      it("should declare all schema correctly (Array - inline - number - OS3)", async () => {
        class Controller {
          @Consumes("application/json")
          @OperationPath("POST", "/")
          method(@In("body") products: number[]) {}
        }

        // THEN
        const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});

        expect(spec).toEqual({
          paths: {
            "/": {
              post: {
                operationId: "controllerMethod",
                parameters: [],
                requestBody: {
                  content: {
                    "application/json": {
                      schema: {
                        type: "array",
                        items: {
                          type: "object"
                        }
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
        const spec = getSpec(Controller, {specType: SpecTypes.SWAGGER});
        expect(await validateSpec(spec)).toBe(true);
        expect(spec).toEqual({
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
      it("should declare all schema correctly (inline -  openspec3)", async () => {
        class Controller {
          @Consumes("application/json")
          @OperationPath("POST", "/")
          method(
            @In("body") @Required() @Name("num") @CollectionOf(Number) @Min(0) num: number[],
            @In("body") @Required() @Name("test") @Min(0) num2: number
          ) {}
        }

        // THEN
        const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});
        expect(await validateSpec(spec, SpecTypes.OPENAPI)).toBe(true);
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
    });
    describe("Cookies", () => {
      it("should declare all schema correctly (OS3)", async () => {
        class Controller {
          @Consumes("application/json")
          @OperationPath("POST", "/")
          method(@In(JsonParameterTypes.COOKIES) @Name("hello") @Required() hello: string) {}
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
                parameters: [
                  {
                    in: "cookie",
                    name: "hello",
                    required: true,
                    schema: {
                      type: "string"
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
      const spec = getSpec(Controller, {specType: SpecTypes.SWAGGER});

      expect(spec).toEqual({
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
    it("should declare all schema correctly (openspec3)", async () => {
      // WHEN
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, String).Description("description"))
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
    it("should declare an Array of string (openspec3)", async () => {
      // WHEN
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, Array).Of(String).Description("description"))
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
  });
});
