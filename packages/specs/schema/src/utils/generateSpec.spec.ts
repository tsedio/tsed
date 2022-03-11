import {generateSpec, In, Name, OperationPath, Path} from "@tsed/schema";
import {join} from "path";

describe("generateSpec()", () => {
  it("should generate spec with options (swagger 2)", () => {
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

    const result = generateSpec({
      tokens: [
        {token: Controller1, rootPath: "/rest"},
        {token: Controller2, rootPath: "/rest"}
      ],
      specPath: join(__dirname, "__mock__", "spec.json")
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
  it("should generate spec with options (OpenAPI 3)", () => {
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

    const result = generateSpec({
      tokens: [
        {token: Controller1, rootPath: "/rest"},
        {token: Controller2, rootPath: "/rest"}
      ],
      specVersion: "3.0.1",
      specPath: join(__dirname, "__mock__", "spec.json")
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

  it("should generate spec with given data (swagger2)", () => {
    const result = generateSpec({
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

  it("should generated default spec (swagger2)", () => {
    // @ts-ignore
    const result = generateSpec({tokens: []});
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
});
