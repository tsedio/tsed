import {OpenSpec2, OpenSpec3} from "@tsed/openspec";

import {mergeSpec} from "./mergeSpec.js";

describe("mergeSpec", () => {
  describe("security", () => {
    it("should merge spec", () => {
      const spec1: OpenSpec2 = {
        swagger: "2.0",
        paths: {
          "/get": {
            get: {
              operationId: "id",
              security: [
                {
                  openid: ["profile", "email"]
                },
                {
                  ga: ["profile", "email"]
                }
              ],
              responses: {}
            }
          }
        }
      };

      const spec2: OpenSpec2 = {
        swagger: "2.0",
        paths: {
          "/get": {
            get: {
              operationId: "id",
              security: [
                {
                  fb: ["profile", "email"],
                  openid: ["profile", "email"]
                },
                {
                  ga: ["profile", "email", "custom"]
                }
              ],
              responses: {}
            }
          }
        }
      };

      expect(mergeSpec(spec1, spec2)).toEqual({
        paths: {
          "/get": {
            get: {
              operationId: "id",
              responses: {},
              security: [
                {
                  fb: ["profile", "email"],
                  openid: ["profile", "email"]
                },
                {
                  ga: ["profile", "email", "custom"]
                }
              ]
            }
          }
        },
        swagger: "2.0"
      });
    });
  });
  describe("allOf", () => {
    it("should merge spec by type", () => {
      const spec1: OpenSpec2 = {
        swagger: "2.0",
        paths: {
          "/get": {
            get: {
              operationId: "id",
              responses: {
                "200": {
                  description: "description",
                  schema: {
                    type: "object",
                    properties: {
                      test: {
                        allOf: [
                          {
                            type: "string"
                          },
                          {
                            type: "number"
                          }
                        ]
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      const spec2: OpenSpec2 = {
        swagger: "2.0",
        paths: {
          "/get": {
            get: {
              operationId: "id",
              responses: {
                "200": {
                  description: "description",
                  schema: {
                    type: "object",
                    properties: {
                      test: {
                        allOf: [
                          {
                            type: "string"
                          },
                          {
                            type: "number",
                            minimum: 1
                          },
                          {
                            type: "boolean"
                          }
                        ]
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      expect(mergeSpec(spec1, spec2)).toEqual({
        paths: {
          "/get": {
            get: {
              operationId: "id",
              responses: {
                "200": {
                  description: "description",
                  schema: {
                    properties: {
                      test: {
                        allOf: [
                          {
                            type: "string"
                          },
                          {
                            minimum: 1,
                            type: "number"
                          },
                          {
                            type: "boolean"
                          }
                        ]
                      }
                    },
                    type: "object"
                  }
                }
              }
            }
          }
        },
        swagger: "2.0"
      });
    });
    it("should merge spec by $ref", () => {
      const spec1: OpenSpec2 = {
        swagger: "2.0",
        paths: {
          "/get": {
            get: {
              operationId: "id",
              responses: {
                "200": {
                  description: "description",
                  schema: {
                    type: "object",
                    properties: {
                      test: {
                        allOf: [
                          {
                            $ref: "#/definitions/MyClass1"
                          },
                          {
                            $ref: "#/definitions/MyClass2"
                          }
                        ]
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };
      const spec2: OpenSpec2 = {
        swagger: "2.0",
        paths: {
          "/get": {
            get: {
              operationId: "id",
              responses: {
                "200": {
                  description: "description",
                  schema: {
                    type: "object",
                    properties: {
                      test: {
                        allOf: [
                          {
                            type: "string"
                          },
                          {
                            type: "number",
                            minimum: 1
                          },
                          {
                            $ref: "#/definitions/MyClass2"
                          }
                        ]
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      expect(mergeSpec(spec1, spec2)).toEqual({
        paths: {
          "/get": {
            get: {
              operationId: "id",
              responses: {
                "200": {
                  description: "description",
                  schema: {
                    properties: {
                      test: {
                        allOf: [
                          {
                            $ref: "#/definitions/MyClass1"
                          },
                          {
                            $ref: "#/definitions/MyClass2"
                          },
                          {
                            type: "string"
                          },
                          {
                            minimum: 1,
                            type: "number"
                          }
                        ]
                      }
                    },
                    type: "object"
                  }
                }
              }
            }
          }
        },
        swagger: "2.0"
      });
    });
  });
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
