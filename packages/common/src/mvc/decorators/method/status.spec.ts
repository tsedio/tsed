import {getSpec} from "@tsed/schema";
import "@tsed/swagger";
import {expect} from "chai";
import {Get, Status} from "../../../../src/mvc";

describe("Status", () => {
  it("should store metadata (200)", () => {
    // GIVEN
    class TypeC {}

    // WHEN
    class Test {
      @Get("/")
      @Status(200, {
        type: TypeC,
        collectionType: Array,
        description: "description",
        headers: {
          "x-header": {
            type: "string"
          }
        }
      })
      get() {}
    }

    // THEN
    const spec = getSpec(Test);

    expect(spec).to.deep.eq({
      definitions: {
        TypeC: {
          type: "object"
        }
      },
      paths: {
        "/": {
          get: {
            operationId: "testGet",
            parameters: [],
            produces: ["application/json"],
            responses: {
              "200": {
                description: "description",
                headers: {
                  "x-header": {
                    type: "string"
                  }
                },
                schema: {
                  items: {
                    $ref: "#/definitions/TypeC"
                  },
                  type: "array"
                }
              }
            },
            tags: ["Test"]
          }
        }
      },
      tags: [
        {
          name: "Test"
        }
      ]
    });
  });
  it("should store metadata (204)", () => {
    // GIVEN
    class TypeC {}

    // WHEN
    class Test {
      @Get("/")
      @Status(204, {
        type: TypeC,
        collectionType: Array,
        description: "description",
        headers: {
          "x-header": {
            type: "string"
          }
        }
      })
      get() {}
    }

    // THEN
    const spec = getSpec(Test);

    expect(spec).to.deep.eq({
      definitions: {
        TypeC: {
          type: "object"
        }
      },
      paths: {
        "/": {
          get: {
            operationId: "testGet",
            parameters: [],
            produces: ["application/json"],
            responses: {
              "204": {
                description: "description",
                headers: {
                  "x-header": {
                    type: "string"
                  }
                }
              }
            },
            tags: ["Test"]
          }
        }
      },
      tags: [
        {
          name: "Test"
        }
      ]
    });
  });
  it("should store metadata (201)", () => {
    // GIVEN
    class TypeC {}

    // WHEN
    class Test {
      @Get("/")
      @Status(201, {
        type: TypeC,
        collectionType: Array,
        description: "description",
        headers: {
          "x-header": {
            type: "string"
          }
        }
      })
      get() {}
    }

    // THEN
    const spec = getSpec(Test);

    expect(spec).to.deep.eq({
      definitions: {
        TypeC: {
          type: "object"
        }
      },
      paths: {
        "/": {
          get: {
            operationId: "testGet",
            parameters: [],
            produces: ["application/json"],
            responses: {
              "201": {
                description: "description",
                headers: {
                  "x-header": {
                    type: "string"
                  }
                },
                schema: {
                  items: {
                    $ref: "#/definitions/TypeC"
                  },
                  type: "array"
                }
              }
            },
            tags: ["Test"]
          }
        }
      },
      tags: [
        {
          name: "Test"
        }
      ]
    });
  });
  it("should store metadata (404)", () => {
    // GIVEN
    class TypeC {}

    class CustomError {}

    // WHEN
    class Test {
      @Get("/")
      @Status(404, {
        type: CustomError,
        description: "description",
        headers: {
          "x-error": {
            type: "string"
          }
        }
      })
      @Status(200, {
        type: TypeC,
        collectionType: Array,
        description: "description",
        headers: {
          "x-map": {
            type: "string"
          }
        }
      })
      get() {}
    }

    // THEN
    const spec = getSpec(Test);

    expect(spec).to.deep.eq({
      definitions: {
        CustomError: {
          type: "object"
        },
        TypeC: {
          type: "object"
        }
      },
      paths: {
        "/": {
          get: {
            operationId: "testGet",
            parameters: [],
            produces: ["application/json"],
            responses: {
              "200": {
                description: "description",
                headers: {
                  "x-map": {
                    type: "string"
                  }
                },
                schema: {
                  items: {
                    $ref: "#/definitions/TypeC"
                  },
                  type: "array"
                }
              },
              "404": {
                description: "description",
                headers: {
                  "x-error": {
                    type: "string"
                  }
                },
                schema: {
                  $ref: "#/definitions/CustomError"
                }
              }
            },
            tags: ["Test"]
          }
        }
      },
      tags: [
        {
          name: "Test"
        }
      ]
    });
  });
});
