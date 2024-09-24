import {BodyParams} from "@tsed/platform-params";
import {join} from "path";

import {validateSpec} from "../../test/helpers/validateSpec.js";
import {CollectionOf} from "../decorators/collections/collectionOf.js";
import {AnyOf} from "../decorators/common/anyOf.js";
import {Description} from "../decorators/common/description.js";
import {Min} from "../decorators/common/minimum.js";
import {Name} from "../decorators/common/name.js";
import {Property} from "../decorators/common/property.js";
import {Required} from "../decorators/common/required.js";
import {Consumes} from "../decorators/operations/consumes.js";
import {In} from "../decorators/operations/in.js";
import {OperationPath} from "../decorators/operations/operationPath.js";
import {Path} from "../decorators/operations/path.js";
import {Returns} from "../decorators/operations/returns.js";
import {Post} from "../decorators/operations/route.js";
import {SpecTypes} from "../domain/SpecTypes.js";
import {generateSpec} from "./generateSpec.js";

const rootDir = import.meta.dirname;

describe("generateSpec()", () => {
  describe("OS 3.0.1", () => {
    it("should generate spec with options", async () => {
      // WHEN
      @Path("/controller1")
      class Controller1 {
        @OperationPath("GET", "/:id?")
        method(@In("path") @Name("id") id: string) {}
      }

      @Path("/controller2")
      class Controller2 {
        @OperationPath("GET", "/:id?")
        method(@In("path") @Name("id") id: string) {}
      }

      const result = await generateSpec({
        tokens: [
          {token: Controller1, rootPath: "/rest"},
          {token: Controller2, rootPath: "/rest"}
        ],
        specVersion: "3.0.1",
        specPath: join(rootDir, "__mock__", "spec.json")
      });

      expect(result).toEqual({
        info: {
          contact: {
            email: "apiteam@swagger.io"
          },
          description:
            "This is a sample server Petstore server.  You can find out more about     Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).      For this sample, you can use the api key `special-key` to test the authorization     filters.",
          license: {
            name: "Apache 2.0",
            url: "http://www.apache.org/licenses/LICENSE-2.0.html"
          },
          termsOfService: "http://swagger.io/terms/",
          title: "Swagger Petstore",
          version: "1.0.0"
        },
        openapi: "3.0.1",
        paths: {
          "/rest/controller1": {
            get: {
              operationId: "controller1Method",
              parameters: [],
              responses: {
                "200": {
                  description: "Success"
                }
              },
              tags: ["Controller1"]
            }
          },
          "/rest/controller1/{id}": {
            get: {
              operationId: "controller1MethodById",
              parameters: [
                {
                  in: "path",
                  name: "id",
                  required: true,
                  schema: {
                    type: "string"
                  }
                }
              ],
              responses: {
                "200": {
                  description: "Success"
                }
              },
              tags: ["Controller1"]
            }
          },
          "/rest/controller2": {
            get: {
              operationId: "controller2Method",
              parameters: [],
              responses: {
                "200": {
                  description: "Success"
                }
              },
              tags: ["Controller2"]
            }
          },
          "/rest/controller2/{id}": {
            get: {
              operationId: "controller2MethodById",
              parameters: [
                {
                  in: "path",
                  name: "id",
                  required: true,
                  schema: {
                    type: "string"
                  }
                }
              ],
              responses: {
                "200": {
                  description: "Success"
                }
              },
              tags: ["Controller2"]
            }
          }
        },
        tags: [
          {
            name: "Controller1"
          },
          {
            name: "Controller2"
          }
        ]
      });
    });

    it("should generate spec and correctly merge shared model with custom schema", async () => {
      class Model {
        @AnyOf(Number, Boolean, String, {type: "array", items: {type: "number"}}, {type: "array", items: {type: "string"}})
        test: number | boolean | string | number[] | string[];
      }

      @Path("/controller1")
      class Controller1 {
        @Post("/post")
        method(@BodyParams() body: Model) {}
      }

      @Path("/controller2")
      class Controller2 {
        @Post("/post")
        method(@BodyParams() body: Model) {}
      }

      const result = await generateSpec({
        tokens: [
          {token: Controller1, rootPath: "/rest"},
          {token: Controller2, rootPath: "/rest"}
        ],
        specVersion: "3.0.1",
        specPath: join(rootDir, "__mock__", "spec.json")
      });

      expect(result).toEqual({
        info: {
          contact: {
            email: "apiteam@swagger.io"
          },
          description:
            "This is a sample server Petstore server.  You can find out more about     Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).      For this sample, you can use the api key `special-key` to test the authorization     filters.",
          license: {
            name: "Apache 2.0",
            url: "http://www.apache.org/licenses/LICENSE-2.0.html"
          },
          termsOfService: "http://swagger.io/terms/",
          title: "Swagger Petstore",
          version: "1.0.0"
        },
        openapi: "3.0.1",
        paths: {
          "/rest/controller1/post": {
            post: {
              operationId: "controller1Method",
              parameters: [],
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Model"
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
          },
          "/rest/controller2/post": {
            post: {
              operationId: "controller2Method",
              parameters: [],
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Model"
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
              tags: ["Controller2"]
            }
          }
        },
        tags: [
          {
            name: "Controller1"
          },
          {
            name: "Controller2"
          }
        ],
        components: {
          schemas: {
            Model: {
              type: "object",
              properties: {
                test: {
                  anyOf: [
                    {type: "number"},
                    {type: "boolean"},
                    {type: "string"},
                    {type: "array", items: {type: "number"}},
                    {type: "array", items: {type: "string"}}
                  ]
                }
              }
            }
          }
        }
      });
    });
  });
  describe("Swagger 2", () => {
    it("should generate spec with options", async () => {
      // WHEN
      @Path("/controller1")
      class Controller1 {
        @OperationPath("GET", "/:id?")
        method(@In("path") @Name("id") id: string) {}
      }

      @Path("/controller2")
      class Controller2 {
        @OperationPath("GET", "/:id?")
        method(@In("path") @Name("id") id: string) {}
      }

      const result = await generateSpec({
        tokens: [
          {token: Controller1, rootPath: "/rest"},
          {token: Controller2, rootPath: "/rest"}
        ],
        specPath: join(rootDir, "__mock__", "spec.json")
      });

      expect(result).toEqual({
        consumes: ["application/json"],
        info: {
          contact: {
            email: "apiteam@swagger.io"
          },
          description:
            "This is a sample server Petstore server.  You can find out more about     Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).      For this sample, you can use the api key `special-key` to test the authorization     filters.",
          license: {
            name: "Apache 2.0",
            url: "http://www.apache.org/licenses/LICENSE-2.0.html"
          },
          termsOfService: "http://swagger.io/terms/",
          title: "Swagger Petstore",
          version: "1.0.0"
        },
        paths: {
          "/rest/controller1": {
            get: {
              operationId: "controller1Method",
              parameters: [],
              responses: {
                "200": {
                  description: "Success"
                }
              },
              tags: ["Controller1"]
            }
          },
          "/rest/controller1/{id}": {
            get: {
              operationId: "controller1MethodById",
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
              tags: ["Controller1"]
            }
          },
          "/rest/controller2": {
            get: {
              operationId: "controller2Method",
              parameters: [],
              responses: {
                "200": {
                  description: "Success"
                }
              },
              tags: ["Controller2"]
            }
          },
          "/rest/controller2/{id}": {
            get: {
              operationId: "controller2MethodById",
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
              tags: ["Controller2"]
            }
          }
        },
        produces: ["application/json"],
        securityDefinitions: {
          calendar_auth: {
            authorizationUrl: "http://petstore.swagger.io/oauth/dialog",
            flow: "implicit",
            scopes: {
              "read:calendar": "read your pets",
              "write:calendar": "modify pets in your account"
            },
            type: "oauth2"
          },
          global_auth: {
            authorizationUrl: "http://petstore.swagger.io/oauth/dialog",
            flow: "implicit",
            scopes: {
              "read:global": "read your pets",
              "write:global": "modify pets in your account"
            },
            type: "oauth2"
          }
        },
        swagger: "2.0",
        tags: [
          {
            name: "Controller1"
          },
          {
            name: "Controller2"
          }
        ]
      });
    });
    it("should generate spec with given data", async () => {
      const result = await generateSpec({
        tokens: [],
        spec: {
          produces: ["application/json", "application/octet-stream", "application/xml"]
        }
      });

      expect(result).toEqual({
        swagger: "2.0",
        info: {
          title: "Api documentation",
          version: "1.0.0"
        },
        produces: ["application/json", "application/octet-stream", "application/xml"],
        consumes: ["application/json"]
      });
    });
    it("should generated default spec", async () => {
      // @ts-ignore
      const result = await generateSpec({tokens: []});
      expect(result).toEqual({
        consumes: ["application/json"],
        info: {
          title: "Api documentation",
          version: "1.0.0"
        },
        produces: ["application/json"],
        swagger: "2.0"
      });
    });
    it("PATH - should declare all schema correctly", async () => {
      // WHEN
      class Controller {
        @OperationPath("GET", "/")
        method(@In("path") @Name("basic") basic: string) {}
      }

      // THEN
      const spec = await generateSpec({
        tokens: [{token: Controller}],
        specType: SpecTypes.SWAGGER
      });

      expect(await validateSpec(spec)).toBe(true);
    });
    it("PATH - should declare all schema correctly with expression", async () => {
      // WHEN
      class Controller {
        @OperationPath("GET", "/:id?")
        method(@In("path") id: string) {}
      }

      // THEN
      const spec = await generateSpec({
        tokens: [{token: Controller}],
        specType: SpecTypes.SWAGGER
      });

      expect(await validateSpec(spec)).toBe(true);
      expect(spec).toEqual({
        consumes: ["application/json"],
        info: {
          title: "Api documentation",
          version: "1.0.0"
        },
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
        },
        produces: ["application/json"],
        swagger: "2.0",
        tags: [
          {
            name: "Controller"
          }
        ]
      });
    });
    it("QUERY - should declare all schema correctly (query)", async () => {
      // WHEN
      class Controller {
        @OperationPath("GET", "/:id")
        method(@In("query") @Name("basic") basic: string) {}
      }

      // THEN
      const spec = await generateSpec({tokens: [{token: Controller}], specType: SpecTypes.SWAGGER});

      expect(spec).toEqual({
        consumes: ["application/json"],
        info: {
          title: "Api documentation",
          version: "1.0.0"
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
        },
        produces: ["application/json"],
        swagger: "2.0",
        tags: [
          {
            name: "Controller"
          }
        ]
      });
    });
    it("QUERY - should declare all schema correctly (query - model)", async () => {
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
      const spec = await generateSpec({
        tokens: [{token: Controller}],
        specType: SpecTypes.SWAGGER
      });

      expect(spec).toEqual({
        consumes: ["application/json"],
        info: {
          title: "Api documentation",
          version: "1.0.0"
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
              },
              tags: ["Controller"]
            }
          }
        },
        produces: ["application/json"],
        swagger: "2.0",
        tags: [
          {
            name: "Controller"
          }
        ]
      });
    });
    it("QUERY - should declare all schema correctly (query - array string)", async () => {
      // WHEN
      class Controller {
        @OperationPath("GET", "/:id")
        method(@In("query") @Name("basic") basic: string[]) {}
      }

      // THEN
      const spec = await generateSpec({
        tokens: [{token: Controller}],
        specType: SpecTypes.SWAGGER
      });

      expect(spec).toEqual({
        consumes: ["application/json"],
        info: {
          title: "Api documentation",
          version: "1.0.0"
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
                  collectionFormat: "multi",
                  in: "query",
                  items: {
                    type: "object"
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
              },
              tags: ["Controller"]
            }
          }
        },
        produces: ["application/json"],
        swagger: "2.0",
        tags: [
          {
            name: "Controller"
          }
        ]
      });
    });
    it("QUERY - should declare all schema correctly (query - Map)", async () => {
      // WHEN
      class Controller {
        @OperationPath("GET", "/:id")
        method(@In("query") @Name("basic") @CollectionOf(String) basic: Map<string, string>) {}
      }

      // THEN
      const spec = await generateSpec({
        tokens: [{token: Controller}],
        specType: SpecTypes.SWAGGER
      });

      expect(spec).toEqual({
        consumes: ["application/json"],
        info: {
          title: "Api documentation",
          version: "1.0.0"
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
                  additionalProperties: {
                    type: "string"
                  },
                  in: "query",
                  name: "basic",
                  required: false,
                  type: "object"
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
        produces: ["application/json"],
        swagger: "2.0",
        tags: [
          {
            name: "Controller"
          }
        ]
      });
    });
    it("BODY - should declare all schema correctly (model)", async () => {
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
      const spec = await generateSpec({tokens: [{token: Controller}], specType: SpecTypes.SWAGGER});

      expect(spec).toEqual({
        consumes: ["application/json"],
        definitions: {
          MyModel: {
            properties: {
              prop: {
                type: "string"
              }
            },
            type: "object"
          }
        },
        info: {
          title: "Api documentation",
          version: "1.0.0"
        },
        paths: {
          "/": {
            post: {
              consumes: ["application/json"],
              operationId: "controllerMethod",
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
        },
        produces: ["application/json"],
        swagger: "2.0",
        tags: [
          {
            name: "Controller"
          }
        ]
      });
    });
    it("BODY - should declare all schema correctly (Array - model)", async () => {
      // WHEN
      class Product {
        @Property()
        title: string;
      }

      class Controller {
        @OperationPath("POST", "/")
        method(@In("body") @CollectionOf(Product) products: Product[]) {
          return null;
        }
      }

      // THEN
      const spec = await generateSpec({tokens: [{token: Controller}], specType: SpecTypes.SWAGGER});

      expect(spec).toEqual({
        consumes: ["application/json"],
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
        info: {
          title: "Api documentation",
          version: "1.0.0"
        },
        paths: {
          "/": {
            post: {
              consumes: ["application/json"],
              operationId: "controllerMethod",
              parameters: [
                {
                  in: "body",
                  name: "body",
                  required: false,
                  schema: {
                    items: {
                      $ref: "#/definitions/Product"
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
        produces: ["application/json"],
        swagger: "2.0",
        tags: [
          {
            name: "Controller"
          }
        ]
      });
    });
    it("BODY - should declare all schema correctly (Map - model)", async () => {
      // WHEN
      class Product {
        @Property()
        title: string;
      }

      class Controller {
        @OperationPath("POST", "/")
        method(@In("body") @CollectionOf(Product) products: Map<string, Product>) {
          return null;
        }
      }

      // THEN
      const spec = await generateSpec({tokens: [{token: Controller}], specType: SpecTypes.SWAGGER});

      expect(spec).toEqual({
        consumes: ["application/json"],
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
        info: {
          title: "Api documentation",
          version: "1.0.0"
        },
        paths: {
          "/": {
            post: {
              consumes: ["application/json"],
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
              responses: {
                "200": {
                  description: "Success"
                }
              },
              tags: ["Controller"]
            }
          }
        },
        produces: ["application/json"],
        swagger: "2.0",
        tags: [
          {
            name: "Controller"
          }
        ]
      });
    });
    it("BODY - should declare all schema correctly (inline)", async () => {
      class Controller {
        @Consumes("application/json")
        @OperationPath("POST", "/")
        method(@In("body") @Required() @Name("num") @Min(0) num: number, @In("body") @Required() @Name("test") @Min(0) num2: number) {}
      }

      // THEN
      const spec = await generateSpec({tokens: [{token: Controller}], specType: SpecTypes.SWAGGER});

      expect(spec).toEqual({
        consumes: ["application/json"],
        info: {
          title: "Api documentation",
          version: "1.0.0"
        },
        paths: {
          "/": {
            post: {
              consumes: ["application/json"],
              operationId: "controllerMethod",
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
              },
              tags: ["Controller"]
            }
          }
        },
        produces: ["application/json"],
        swagger: "2.0",
        tags: [
          {
            name: "Controller"
          }
        ]
      });
    });
    it("BODY - should declare all schema correctly (Array - inline)", async () => {
      class Controller {
        @Consumes("application/json")
        @OperationPath("POST", "/")
        method(
          @In("body") @Required() @Name("num") @CollectionOf(Number) @Min(0) num: number[],
          @In("body") @Required() @Name("test") @Min(0) num2: number
        ) {}
      }

      // THEN
      const spec = await generateSpec({tokens: [{token: Controller}], specType: SpecTypes.SWAGGER});
      expect(await validateSpec(spec)).toBe(true);
      expect(spec).toEqual({
        consumes: ["application/json"],
        info: {
          title: "Api documentation",
          version: "1.0.0"
        },
        paths: {
          "/": {
            post: {
              consumes: ["application/json"],
              operationId: "controllerMethod",
              parameters: [
                {
                  in: "body",
                  name: "body",
                  required: true,
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
        produces: ["application/json"],
        swagger: "2.0",
        tags: [
          {
            name: "Controller"
          }
        ]
      });
    });
    it("RESPONSE - should declare all schema correctly", async () => {
      // WHEN
      @Name("AliasController")
      @Description("Class description")
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, String).Description("description"))
        method() {}
      }

      // THEN
      const spec = await generateSpec({tokens: [{token: Controller}], specType: SpecTypes.SWAGGER});

      expect(spec).toEqual({
        consumes: ["application/json"],
        info: {
          title: "Api documentation",
          version: "1.0.0"
        },
        paths: {
          "/": {
            post: {
              operationId: "aliasControllerMethod",
              parameters: [],
              produces: ["application/octet-stream"],
              responses: {
                "200": {
                  description: "description",
                  schema: {
                    type: "string"
                  }
                }
              },
              tags: ["AliasController"]
            }
          }
        },
        produces: ["application/json"],
        swagger: "2.0",
        tags: [
          {
            description: "Class description",
            name: "AliasController"
          }
        ]
      });
    });
    it("RESPONSE - should declare an Array of string", async () => {
      // WHEN
      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, Array).Of(String).Description("description"))
        method() {}
      }

      // THEN
      const spec = await generateSpec({tokens: [{token: Controller}], specType: SpecTypes.SWAGGER});

      expect(spec).toEqual({
        consumes: ["application/json"],
        info: {
          title: "Api documentation",
          version: "1.0.0"
        },
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
        },
        produces: ["application/json"],
        swagger: "2.0",
        tags: [
          {
            name: "Controller"
          }
        ]
      });
    });

    it("HEADERS - should declare a return type with headers", async () => {
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
      const spec = await generateSpec({tokens: [{token: Controller}], specType: SpecTypes.SWAGGER});

      expect(spec).toEqual({
        consumes: ["application/json"],
        info: {
          title: "Api documentation",
          version: "1.0.0"
        },
        paths: {
          "/": {
            post: {
              operationId: "controllerMethod",
              parameters: [],
              produces: ["application/octet-stream"],
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
                  schema: {
                    minLength: 3,
                    type: "string"
                  }
                }
              },
              tags: ["Controller"]
            }
          }
        },
        produces: ["application/json"],
        swagger: "2.0",
        tags: [
          {
            name: "Controller"
          }
        ]
      });
    });
  });
});
