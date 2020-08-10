import {prototypeOf} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {JsonFoo2} from "../../../../../test/helper/classes";
import {getJsonSchema, PropertyFn} from "../../../src/jsonschema";
import {Property} from "./property";

describe("Property()", () => {
  it("should create schema from options", () => {
    class Model {
      @Property({use: String, name: "test"})
      test: string[];
    }

    expect(getJsonSchema(Model)).to.deep.eq({
      "definitions": {},
      "properties": {
        "test": {
          "items": {
            "type": "string"
          },
          "type": "array"
        }
      },
      "type": "object"
    });
  });
  it("should create schema from Name", () => {
    class Model {
      @Property("test")
      test: string;
    }

    expect(getJsonSchema(Model)).to.deep.eq({
      "definitions": {},
      "properties": {
        "test": {
          "type": "string"
        }
      },
      "type": "object"
    });
  });
  it("should create schema from Class", () => {
    class Model {
      @Property(String)
      test: string[];
    }

    expect(getJsonSchema(Model)).to.deep.eq({
      "definitions": {},
      "properties": {
        "test": {
          "items": {
            "type": "string"
          },
          "type": "array"
        }
      },
      "type": "object"
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
      required: ["test", "foo"],
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
        object: {
          type: "object"
        },
        password: {
          type: "string"
        },
        nameModel: {
          $ref: "#/definitions/JsonNameModel"
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
