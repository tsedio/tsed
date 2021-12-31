import {OpenSpec3} from "@tsed/openspec";
import {mergeSpec} from "./mergeSpec";

describe("mergeSpec", () => {
  describe("oneOf", () => {
    it("should merge spec", () => {
      const spec1: OpenSpec3 = {
        openapi: "3.0.1",
        info: {
          title: "title",
          version: "1.0.0",
          description: "description"
        },
        paths: {
          "/get": {
            get: {
              operationId: "id",
              parameters: [
                {
                  in: "query",
                  required: false,
                  name: "email",
                  schema: {
                    oneOf: [
                      {
                        $ref: "#/components/schemas/ContainsSearchableString"
                      },
                      {
                        $ref: "#/components/schemas/EqualsSearchableString"
                      }
                    ]
                  }
                }
              ],
              responses: {
                "206": {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/ContactQueryParams"
                      }
                    }
                  },
                  description: "Partial Content"
                }
              }
            }
          }
        }
      };

      const spec2: OpenSpec3 = {
        openapi: "3.0.1",
        info: {
          title: "title",
          version: "1.0.0",
          description: "description"
        },
        paths: {
          "/get": {
            get: {
              operationId: "id",
              parameters: [
                {
                  in: "query",
                  required: false,
                  name: "email",
                  schema: {
                    oneOf: [
                      {
                        $ref: "#/components/schemas/ContainsSearchableString"
                      },
                      {
                        $ref: "#/components/schemas/EqualsSearchableString"
                      }
                    ]
                  }
                }
              ],
              responses: {
                "206": {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/ContactQueryParams"
                      }
                    }
                  },
                  description: "Partial Content"
                }
              }
            }
          }
        }
      };

      expect(mergeSpec(spec1, spec2)).toEqual({
        openapi: "3.0.1",
        info: {
          title: "title",
          version: "1.0.0",
          description: "description"
        },
        paths: {
          "/get": {
            get: {
              operationId: "id",
              parameters: [
                {
                  in: "query",
                  required: false,
                  name: "email",
                  schema: {
                    oneOf: [
                      {
                        $ref: "#/components/schemas/ContainsSearchableString"
                      },
                      {
                        $ref: "#/components/schemas/EqualsSearchableString"
                      }
                    ]
                  }
                }
              ],
              responses: {
                "206": {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/ContactQueryParams"
                      }
                    }
                  },
                  description: "Partial Content"
                }
              }
            }
          }
        }
      });
    });
  });
  describe("merge two specs", () => {
    it("should merge the spec", () => {
      const spec1 = {
        paths: {
          "/rest/api/1.0/test": {
            get: {
              operationId: "helloWorldControllerGet",
              responses: {"200": {description: "Success"}},
              parameters: [],
              tags: ["HelloWorldController"]
            }
          },
          "/rest/api/1.0/test/{id}": {
            get: {
              operationId: "helloWorldControllerGetById",
              responses: {"200": {description: "Success"}},
              parameters: [{in: "path", name: "id", required: true, schema: {type: "string"}}],
              tags: ["HelloWorldController"]
            }
          },
          "/rest/api/2.0/test": {
            get: {
              operationId: "helloWorldController2Get",
              responses: {"200": {description: "Success"}},
              parameters: [],
              tags: ["HelloWorldController2"]
            }
          },
          "/rest/api/2.0/test/{id}": {
            get: {
              operationId: "helloWorldController2GetById",
              responses: {"200": {description: "Success"}},
              parameters: [{in: "path", name: "id", required: true, schema: {type: "string"}}],
              tags: ["HelloWorldController2"]
            }
          }
        }
      };

      const spec2 = {
        paths: {
          "/rest/api/1.0/test": {
            get: {
              operationId: "helloWorldControllerGet",
              responses: {"200": {description: "Success"}},
              parameters: [],
              tags: ["HelloWorldController"]
            }
          },
          "/rest/api/1.0/test/{id}": {
            get: {
              operationId: "helloWorldControllerGetById",
              responses: {"200": {description: "Success"}},
              parameters: [{in: "path", name: "id", required: true, schema: {type: "string"}}],
              tags: ["HelloWorldController"]
            }
          },
          "/rest/api/2.0/test": {
            get: {
              operationId: "helloWorldController2Get",
              responses: {"200": {description: "Success"}},
              parameters: [],
              tags: ["HelloWorldController2"]
            }
          },
          "/rest/api/2.0/test/{id}": {
            get: {
              operationId: "helloWorldController2GetById",
              responses: {"200": {description: "Success"}},
              parameters: [{in: "path", name: "id", required: true, schema: {type: "string"}}],
              tags: ["HelloWorldController2"]
            }
          }
        }
      };

      const spec = mergeSpec(spec1, spec2);

      expect(spec).toEqual({
        paths: {
          "/rest/api/1.0/test": {
            get: {
              operationId: "helloWorldControllerGet",
              responses: {"200": {description: "Success"}},
              parameters: [],
              tags: ["HelloWorldController"]
            }
          },
          "/rest/api/1.0/test/{id}": {
            get: {
              operationId: "helloWorldControllerGetById",
              responses: {"200": {description: "Success"}},
              parameters: [{in: "path", name: "id", required: true, schema: {type: "string"}}],
              tags: ["HelloWorldController"]
            }
          },
          "/rest/api/2.0/test": {
            get: {
              operationId: "helloWorldController2Get",
              responses: {"200": {description: "Success"}},
              parameters: [],
              tags: ["HelloWorldController2"]
            }
          },
          "/rest/api/2.0/test/{id}": {
            get: {
              operationId: "helloWorldController2GetById",
              responses: {"200": {description: "Success"}},
              parameters: [{in: "path", name: "id", required: true, schema: {type: "string"}}],
              tags: ["HelloWorldController2"]
            }
          }
        }
      });
    });
  });
});
