import {prototypeOf} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {JsonFoo2} from "../../../../../test/helper/classes";
import {getJsonSchema, PropertyFn} from "../../../src/jsonschema";
import {Property} from "./property";

describe("Property()", () => {
  it("should create schema from Class", () => {
    class Model {
      @Property(String)
      test: string[];
    }

    expect(getJsonSchema(Model)).to.deep.eq({
      properties: {
        test: {
          items: {
            type: "string"
          },
          type: "array"
        }
      },
      type: "object"
    });
  });
  it("should create a schema", () => {
    expect(getJsonSchema(JsonFoo2)).to.deep.eq({
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
        JsonFoo: {
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
            id: {
              type: "string"
            },
            name: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        Name: {
          minLength: 3,
          type: "string"
        },
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
          $ref: "#/definitions/JsonFoo"
        },
        foos: {
          items: {
            $ref: "#/definitions/JsonFoo"
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
          },
          type: "object"
        },
        nameModel: {
          $ref: "#/definitions/JsonNameModel"
        },
        object: {
          type: "object"
        },
        test: {
          minLength: 3,
          type: "string"
        },
        theMap: {
          additionalProperties: {
            $ref: "#/definitions/JsonFoo1"
          },
          type: "object"
        },
        theSet: {
          items: {
            $ref: "#/definitions/JsonFoo1"
          },
          type: "array",
          uniqueItems: true
        },
        uint: {
          type: "number"
        }
      },
      required: ["test", "foo"],
      type: "object"
    });
  });
});

describe("PropertyFn", () => {
  it("should declare property and call returned decorator", () => {
    const stub = Sinon.stub();

    class Test {
      @PropertyFn(() => {
        return stub;
      })
      test: string;
    }

    expect(stub).to.have.been.calledWithExactly(prototypeOf(Test), "test", undefined);
  });
});
