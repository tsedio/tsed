import {inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import {JsonFoo2} from "../../../../../test/helper/classes";
import {JsonSchemesService} from "../../../src/jsonschema";

describe("JsonSchemesService", () => {
  before(TestContext.create);
  after(TestContext.reset);
  it("should return a schema with his definitions", inject([JsonSchemesService], (service: JsonSchemesService) => {
    // GIVEN
    const result = service.getSchemaDefinition(JsonFoo2);

    // WHEN
    expect(result).to.deep.eq({
      definitions: {
        JsonAgeModel: {
          properties: {
            age: {
              type: "number"
            },
            id: {
              type: "string"
            }
          },
          type: "object"
        },
        JsonFoo1: {
          properties: {
            test: {
              type: "string"
            }
          },
          type: "object"
        },
        JsonNameModel: {
          properties: {
            name: {
              type: "string"
            },
            id: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        ageModel: {
          $ref: "#/definitions/JsonAgeModel"
        },
        arrayOfString: {
          items: {
            type: "string"
          },
          type: "array"
        },
        dateStart: {
          type: "string"
        },
        foo: {
          type: "object"
        },
        foos: {
          items: {
            type: "object"
          },
          type: "array"
        },

        foos2: {
          items: {
            $ref: "#/definitions/JsonFoo1"
          },
          type: "array"
        },
        mapOfString: {
          additionalProperties: {
            type: "string"
          }
        },
        name: {
          minLength: 3,
          type: "string"
        },
        nameModel: {
          $ref: "#/definitions/JsonNameModel"
        },
        object: {
          type: "object"
        },
        password: {
          type: "string"
        },
        test: {
          minLength: 3,
          type: "string"
        },
        theMap: {
          additionalProperties: {
            $ref: "#/definitions/JsonFoo1"
          }
        },
        theSet: {
          additionalProperties: {
            $ref: "#/definitions/JsonFoo1"
          }
        },
        uint: {
          type: "number"
        }
      },
      required: ["test", "foo"],
      type: "object"
    });
  }));
});
